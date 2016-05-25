(function () {
    var APIGEE_ORGNAME = 'sdipu';
    var APIGEE_APPNAME = 'problemsolvinglist';
    var PROBLEMS_TYPE = 'problems';

    /*********************************************************
     * ProblemListApp and
     * HomePageController
     **********************************************************/
    var problemListApp = angular.module('ProblemListApp', []);

    var homepage = {};
    var apiClient = null;

    problemListApp.controller('HomePageController', function ($scope) {
        homepage = $scope;
        homepage.problems = [];
        homepage.categories = [];
        homepage.config = getConfig();
        homepage.selectedCat = "";
        homepage.filterText = "";
        // download and show list of problems
        loadClient(function (client) {
            apiClient = client;
            loadProblems();
        });
        // define functions
        $scope.deleteProblem = deleteProblem;
        $scope.addProblem = addProblem;
        $scope.loadProblems = loadProblems;
        $scope.setCategory = function (cat) {
            homepage.selectedCat = cat;
        };
        $scope.canShow = function (prob) {
            if (homepage.selectedCat && prob.category != homepage.selectedCat) {
                return false;
            }
            if (homepage.filterText) {

            }
            return true;
        }
    });

    /*********************************************************
     * APIGEE Client.
     * CRUD using Apigee client
     **********************************************************/
    function loadClient(callback) {
        callback(new Apigee.Client({
            orgName: APIGEE_ORGNAME,
            appName: APIGEE_APPNAME,
            logging: false, //optional - turn on logging, off by default
            buildCurl: false //optional - log network calls in the console, off by default
        }));
    }

    function loadProblems() {
        var properties = {
            type: PROBLEMS_TYPE
        };
        /* We pass our properties to getEntity(), which initiates our GET request: */
        apiClient.getEntity(properties, function (errorStatus, response, errorMessage) {
            if (errorStatus) {
                // Error - there was a problem creating the entity
                alert("Error! Unable to create your entity. "
                    + "See console to view detailed error message.");
                console.log(errorMessage);
            } else {
                // Success - the entities received
                //console.log(response);
                homepage.problems = response.entities;
                buildCategory();
            }
        });
    }

    var categoryData = {};

    function buildCategory() {
        homepage.problems.forEach(function (prob) {
            formatProblem(prob);
            if (prob.category) {
                categoryData[prob.category] = prob.category;
            }
        });
        homepage.categories = Object.getOwnPropertyNames(categoryData);
    }

    function addProblem(prob) {
        if (!(prob.link && prob.category)) {
            alert("Please fill all necessary fields.");
            return;
        }
        // define data type
        formatProblem(prob);
        prob.type = PROBLEMS_TYPE;
        // send request to api client
        apiClient.createEntity(prob, function (errorStatus, response, errorMessage) {
            if (errorStatus) {
                // Error - there was a problem creating the entity
                alert("Error! Unable to create your entity. "
                    + "Did you enter the correct organization name?");
                console.log(errorMessage);
            } else {
                // Success - the entity was created properly
                //console.log(response);

                homepage.problems.push(prob);
                categoryData[prob.category] = prob.category;
                homepage.categories = Object.getOwnPropertyNames(categoryData);
            }
        });
    }

    function deleteProblem(prob) {
        var properties = {
            client: dataClient,
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
                alert("Error! Unable to create your entity. "
                    + "See console to view detailed error message.");
                console.log(error);
            } else {
                // Success - the entity was successfully deleted
                alert("Success! The entity has been deleted.");
                console.log(response);
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

})();

var formatProblem = function (problem) {
    var parser = document.createElement('a');
    parser.href = problem.link;

    var query = parseQueryString(parser.search);
    switch (parser.hostname) {
        case "uva.onlinejudge.org":
            problem.name = "UVA " + query["problem"];
            break;
        default:
            break;
    }

    /*
     parser.protocol; // => "http:"
     parser.hostname; // => "example.com"
     parser.port;     // => "3000"
     parser.pathname; // => "/pathname/"
     parser.search;   // => "?search=test"
     parser.hash;     // => "#hash"
     parser.host;     // => "example.com:3000"
     */
};

var parseQueryString = function (str) {
    var objURL = {};
    str.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) {
            objURL[$1] = $3;
        }
    );
    return objURL;
};