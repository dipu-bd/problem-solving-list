/**
 * @file app.js
 * @desc Controllers for back-end connection and front-end services.
 */

/*********************************************************
 * ALL Variables
 **********************************************************/

var problemListApp = angular.module('ProblemListApp', []);

var LOGGING = true;
var PROBLEMS_TYPE = 'problems';

var homepage = {};
var categoryData = {};
var lastResponseTime = 0;

var clientOptions = {
    orgName: 'sdipu',
    appName: 'problemsolvinglist',
    logging: LOGGING
};

/*********************************************************
 * APIGEE Client Controller.
 **********************************************************/

function doLogin(username, password) {
    // if (LOGGING) console.log("+LOG IN");

    //Call the login function below
    homepage.apiClient.login(username, password, function (error, data, user) {
        if (error) {
            // if (LOGGING) console.log(error);
            homepage.apiClient.set("token", null);
            return alert(error.message || "Could not log in");
        }

        homepage.loggedIn = true;
        homepage.client = user._data;
        homepage.$apply();
    });
}

function doLogout() {
    // if (LOGGING) console.log("+LOG OUT");

    homepage.apiClient.logoutAndDestroyToken(homepage.client.username, null, null, function (error, data) {
        if (error) {
            // if (LOGGING) console.log(error);
            return alert(error.message || "Could not log out");
        }

        homepage.apiClient.set("token", null);
        homepage.loggedIn = false;
        homepage.$apply();
    });
}


function getProblems() {

    setTimeout(function () {
        // if (LOGGING) console.log("+GET PROBLEMS");

        var refreshButton = $("#refresh-button");
        refreshButton.attr("disabled", true);

        var options = {
            endpoint: PROBLEMS_TYPE,
            qs: {limit: 100000000}
        };

        homepage.apiClient.request(options, function (error, response) {

            refreshButton.attr("disabled", false);

            if (error) {
                // if (LOGGING) console.log(error);
            } else {
                //console.log(response);

                // check timestamp
                if (response.timestamp < lastResponseTime) {
                    return;
                }
                lastResponseTime = response.timestamp;

                // set problems
                homepage.categoryData = {};
                homepage.problems = response.entities;

                //build category
                homepage.problems.forEach(function (prob) {
                    formatProblem(prob);
                    if (prob.category) {
                        categoryData[prob.category] = prob.category;
                    }
                });

                // set category
                homepage.categories = Object.getOwnPropertyNames(categoryData);

                // if (LOGGING) console.log(homepage.problems);

                homepage.$apply();
            }
        });

    }, 10);
}

function addProblem(prob) {

    var addButton = $("#add-button");
    addButton.attr("disabled", true);

    setTimeout(function () {
        // if (LOGGING) console.log("+ADD PROBLEM");

        // validity check
        if (!validatePROB(prob)) return;

        // if (LOGGING) console.log("++VALIDATED");

        // define data type
        formatProblem(prob);
        prob.type = PROBLEMS_TYPE;

        // send request to api client
        homepage.apiClient.createEntity(prob, function (error, response) {

            addButton.attr("disabled", false);

            if (error) {
                return alert(error.message || "Error - there was a problem creating the entity");
            }

            var addProb = $('#add-problem');
            addProb.modal('hide');
            addProb.find('form')[0].reset();

            getProblems();
        });
    }, 10);
}

function deleteProblem(prob) {

    if (!confirm("Are your sure to delete this problem?")) {
        return;
    }

    var deleteButton = $("#delete-" + prob.uuid);
    deleteButton.attr('disabled', true);

    setTimeout(function () {
        // if (LOGGING) console.log("+DELETE PROBLEM");

        var properties = {
            client: homepage.apiClient,
            data: {
                type: PROBLEMS_TYPE,
                uuid: prob.uuid
            }
        };

        // create a local Entity object that we can call destroy() on
        var entity = new Apigee.Entity(properties);

        // call the destroy() method to initiate the API DELETE request */
        entity.destroy(function (error, response) {

            if (error) {
                deleteButton.attr('disabled', false);
                return alert(error.message || "Error - there was a problem deleting the entity");
            }

            getProblems();
        });

    }, 10);
}

function updateUser() {
    // if (LOGGING) console.log("+UPDATE USER");

    homepage.loggedIn = homepage.apiClient.isLoggedIn();
    setTimeout(function () {
        homepage.apiClient.getLoggedInUser(function (err, data, user) {
            homepage.client = user._data || {};
            homepage.$apply();
        });
    }, 0);
}

/*********************************************************
 * HomePage Controller
 **********************************************************/

function canShow(prob) {
    if (homepage.selectedCat && prob.category != homepage.selectedCat) {
        return false;
    }
    if (homepage.filterText) {
        var pin = homepage.filterText.toLowerCase().trim();
        var hay = prob.name + " " + prob.link + " " + prob.category;
        hay = hay.toLowerCase().trim();
        return hay.search(pin) >= 0;
    }
    return true;
}

function sortBy(prop) {
    homepage.problems.sort(function (a, b) {
        return a[prop] < b[prop] ? -1 : a[prop] > b[prop];
    });
    homepage.sortedBy = prop;
}

(function () {

    problemListApp.controller('HomePageController', ['$scope', function ($scope) {
        homepage = $scope;
        homepage.problem = {}; // for add problem
        homepage.problems = []; // for problem list
        homepage.categories = []; // for category list
        homepage.selectedCat = ""; // for selected category
        homepage.filterText = ""; // for search text

        // load client
        homepage.apiClient = new Apigee.Client(clientOptions);

        // download and show list of problems
        getProblems();
        //setInterval(getProblems, 10000); // update in every 10sec

        updateUser();

        // define functions
        homepage.sortBy = sortBy;
        homepage.canShow = canShow;
        homepage.doLogin = doLogin;
        homepage.doLogout = doLogout;
        homepage.deleteProblem = deleteProblem;
        homepage.addProblem = addProblem;
        homepage.loadProblems = getProblems;

        homepage.setCategory = function (cat) {
            homepage.selectedCat = cat;
        };
        homepage.clearFilter = function () {
            homepage.filterText = "";
        };

    }]);

    /****************************************************
     * All Directives
     ****************************************************/

    problemListApp.directive('navBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/navbar.html'
        };
    });

    problemListApp.directive('problemList', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/problem-list.html'
        };
    });

    problemListApp.directive('bottomBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/bottom.html'
        };
    });

    problemListApp.directive('addProblems', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/add-problems.html'
        };

    });

    problemListApp.directive('searchProblem', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/search-problems.html'
        };
    });

    problemListApp.directive('loginForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/login-form.html'
        };
    });

    problemListApp.directive('problemToolbar', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/problem-toolbar.html'
        };
    });

})();
