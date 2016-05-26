(function APP() {
    var APIGEE_ORGNAME = 'sdipu';
    var APIGEE_APPNAME = 'problemsolvinglist';
    var PROBLEMS_TYPE = 'problems';

    /*********************************************************
     * ProblemListApp and
     * HomePageController
     **********************************************************/
    var problemListApp = angular.module('ProblemListApp', []);

    var homepage = {};
    var categoryData = {};

    problemListApp.controller('HomePageController', function ($scope) {
        homepage = $scope;
        homepage.config = getConfig();
        homepage.problems = [];
        homepage.categories = [];

        homepage.selectedCat = "";
        homepage.filterText = "";
        homepage.loggedIn = false;
        homepage.client = {};
        homepage.problem = {};

        // download and show list of problems 
        loadProblems();

        // define functions
        $scope.deleteProblem = deleteProblem;
        $scope.addProblem = addProblem;
        $scope.loadProblems = loadProblems;
        $scope.doLogin = doLogin;

        $scope.setCategory = function (cat) {
            homepage.selectedCat = cat;
        };
        $scope.clearFilter = function () {
            homepage.filterText = "";
        };

        $scope.canShow = function (prob) {
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
        };

        $scope.sortBy = function (prop) {
            homepage.problems.sort(function (a, b) {
                return a[prop] < b[prop] ? -1 : a[prop] > b[prop];
            });
            homepage.sortedBy = prop;
        };
    });

    /*********************************************************
     * APIGEE Client.
     * CRUD using Apigee client
     **********************************************************/

    var apiClient = new Apigee.Client({
        orgName: APIGEE_ORGNAME,
        appName: APIGEE_APPNAME,
        logging: false, //optional - turn on logging, off by default
        buildCurl: false //optional - log network calls in the console, off by default
    });

    function doLogin(username, password) {
        //Call the login function below
        apiClient.login(username, password, function (error, data, user) {
            if (error) {
                alert("An error occurred! See console for details");
                console.log(error);
            } else {
                homepage.client = user._data;
                homepage.loggedIn = true;
                loadProblems();
            }
        });
    }

    function loadProblems() {
        setTimeout(function () {
            var properties = {
                type: PROBLEMS_TYPE
            };
            /* We pass our properties to getEntity(), which initiates our GET request: */
            apiClient.getEntity(properties, function (error, response) {
                if (error) {
                    // ERROR: could not get entities
                    console.log(error);
                } else {
                    // Success - the entities received
                    //console.log(response);
                    homepage.problems = response.entities;
                    //build category
                    homepage.problems.forEach(function (prob) {
                        formatProblem(prob);
                        if (prob.category) {
                            categoryData[prob.category] = prob.category;
                        }
                    });
                    homepage.categories = Object.getOwnPropertyNames(categoryData);
                }
            });
        }, 100);
    }

    function addProblem(prob) {
        // validity check
        if (!checkValid(prob)) return;
        // define data type
        formatProblem(prob);
        prob.type = PROBLEMS_TYPE;
        // send request to api client
        apiClient.createEntity(prob, function (errorStatus, response, errorMessage) {
            if (errorStatus) {
                // Error - there was a problem creating the entity
                alert("Error! Please login first.");
                console.log(errorMessage);
            } else {
                // Success - the entity was created properly
                //console.log(response);


                homepage.problems.push(prob);
                categoryData[prob.category] = prob.category;
                homepage.categories = Object.getOwnPropertyNames(categoryData);
                homepage.problem = {};

                loadProblems();
            }
        });
    }

    function deleteProblem(prob) {
        var properties = {
            client: apiClient,
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
                // Error - there was a problem creating the entity
                alert("Error! Please login first.");
                console.log(error);
            } else {
                // Success - the entity was successfully deleted
                alert("Success! The entity has been deleted.");
                console.log(response);

                loadProblems();
            }
        });
    }

    /****************************************************
     * DIRECTIVES
     ****************************************************/
    problemListApp.directive('navBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/navbar.html'
        };
    });

    problemListApp.directive('mainBody', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/home.html'
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

})
();