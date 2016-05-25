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
        // download and show list of problems
        loadClient(function (client) {
            apiClient = client;
            getProblems();
        });
        // define functions
        $scope.deleteProblem = deleteProblem;
        $scope.addProblem = addProblem;
        $scope.viewCategory = getProblems;
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

    function getProblems(category) {
        var properties = {
            type: PROBLEMS_TYPE
        };
        if (category) {
            properties.category = category;
        }
        /* We pass our properties to getEntity(), which initiates our GET request: */
        apiClient.getEntity(properties, function (errorStatus, response, errorMessage) {
            if (errorStatus) {
                // Error - there was a problem creating the entity
                alert("Error! Unable to create your entity. "
                    + "See console to view detailed error message.");
                console.log(errorMessage);
            } else {
                // Success - the entities received
                console.log(response);

                homepage.problems = response.entities;
                buildCategory();
            }
        });
    }

    function buildCategory() {
        var data = {};
        homepage.problems.forEach(function (prob) {
            formatProblem(prob);
            if (prob.category) {
                data[prob.category] = prob.category;
            }
        });
        homepage.categories = Object.getOwnPropertyNames(data);
    }

    function addProblem(prob) {
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
                alert("Success!\nUUID of created Entity: "
                    + JSON.stringify(response.get('uuid')));
                console.log(response);

                //homepage.categories[] = prob.category;
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