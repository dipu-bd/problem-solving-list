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
    var categoryData = {};


    problemListApp.controller('HomePageController', function ($scope) {
        homepage = $scope;
        homepage.problems = [];
        homepage.categories = [];
        homepage.config = getConfig();
        homepage.selectedCat = "";
        homepage.filterText = "";
        homepage.loggedIn = false;
        // download and show list of problems
        loadClient(function (client) {
            apiClient = client;
            loadProblems();
        });
        // define functions
        $scope.deleteProblem = deleteProblem;
        $scope.addProblem = addProblem;
        $scope.loadProblems = loadProblems;
        $scope.doLogin = doLogin;

        $scope.setCategory = function (cat) {
            homepage.selectedCat = cat;
        };

        $scope.canShow = function (prob) {
            if (homepage.selectedCat && prob.category != homepage.selectedCat) {
                return false;
            }
            if (homepage.filterText) {
                return prob.name.search(homepage.filterText) ||
                    prob.link.search(homepage.filterText) ||
                    prob.category.search(homepage.filterText);
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
    function loadClient(callback) {
        callback(new Apigee.Client({
            orgName: APIGEE_ORGNAME,
            appName: APIGEE_APPNAME,
            logging: false, //optional - turn on logging, off by default
            buildCurl: false //optional - log network calls in the console, off by default
        }));
    }

    function doLogin(username, password) {
        //Call the login function below
        apiClient.login(username, password, function(error, data, user){
            if(error) {
                alert("An error occurred! See console for details");
                console.log(error);
            } else {
                homepage.loggedIn = true;
                loadProblems();
            }
        });
    }

    function loadProblems() {
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

})();


var formatProblem = function (problem) {
    var parser = document.createElement('a');
    parser.href = problem.link;

    var paths = parser.pathname.split('/');
    var query = parseQueryString(parser.search);
    switch (parser.hostname) {
        case "uva.onlinejudge.org":
            problem.name = "UVA problem " + query.problem;
            break;
        case "lightoj.com":
            problem.name = "LightOJ problem " + query.problem;
            break;
        case "codeforces.com":
            problem.name = "CodeForces " + paths.join(" ").trim();
            break;
        case "acm.hust.edu.cn":
            //http://acm.hust.edu.cn/vjudge/problem/viewProblem.action?id=23915
            problem.name = "HUST VJudge problem " + query.id;
            break;
        case "acm.hdu.edu.cn":
            //http://acm.hdu.edu.cn/showproblem.php?pid=1608
            problem.name = "HDU problem " + query.pid;
            break;
        case "icpcarchive.ecs.baylor.edu":
            //https://icpcarchive.ecs.baylor.edu/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=5192
            problem.name = "ICPC Archive problem " + query.problem;
            break;
        case "www.codechef.com": //https://www.codechef.com/problems/AMLPALIN
            probem.name = "CodeChef " + paths[2];
            break;
        case "www.spoj.com": //http://www.spoj.com/problems/DISUBSTR/en/
            probem.name = "SPOJ " + paths[2];
            break;
        case "acm.timus.ru" : //http://acm.timus.ru/problem.aspx?space=1&num=1837
            problem.name = "Timus " + query.num;
            break;
        case "judge.u-aizu.ac.jp":
            //http://judge.u-aizu.ac.jp/onlinejudge/description.jsp?id=0019
            problem.name = "Aizu " + query.id;
            break;
        default:
            // most judge has problem tag in search param
            if (query.hasOwnProperty('problem')) {
                problem.name = parser.hostname + " " + query["problem"];
            } else {
                problem.name = parser.hostname + " " +
                    path.join(" ").trim() + " " +
                    parser.search.slice(1) + " " +
                    parser.hash;
                problem.name = problem.name.trim();
            }
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

var checkValid = function (prob) {
    if (!isValidURL(prob.link)) {
        alert("Please provide valid problem link.");
        return false;
    }
    if (!prob.category || prob.category.length < 2) {
        alert("Please provide a valid category name");
        return false;
    }
    return true;
};

var isValidURL = function (str) {
    return (str);
};