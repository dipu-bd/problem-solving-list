/***************************************************
 * ANGULAR controllers and directives
 ****************************************************/
(function () {

    var app = angular.module('ProblemListApp', []);

    var homepage = this;

    /***************************************************
     * HOME PAGE CONTROLLER
     ****************************************************/
    app.controller('IndexController', function ($scope) {
        homepage = $scope;
        homepage.config = getConfig();

        // initialize apigee client
        homepage.catmap = {};
        homepage.problems = [];
        homepage.loggedIn = false;
    });

    /***************************************************
     * DIRECTIVES and CONTROLLERS
     ****************************************************/
    app.directive('loginForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'forms/login-form.html',
            controller: function ($scope) {
                $scope.client = {};
                $scope.login = login;
            }
        };
    });
    app.directive('addProblem', function () {
        return {
            restrict: 'E',
            templateUrl: 'forms/add-problem.html',
            controller: function ($scope) {
            }
        };
    });
    app.directive('editProblem', function () {
        return {
            restrict: 'E',
            templateUrl: 'forms/edit-problem.html',
            controller: function ($scope) {
            }
        };
    });

    app.directive('topBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'elements/top-bar.html',
            controller: function ($scope) {
                $scope.logout = logout;
            }
        };
    });
    app.directive('bottomBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'elements/bottom-bar.html'
        };
    });
    app.directive('mainPage', function () {
        return {
            restrict: 'E',
            templateUrl: 'elements/main-page.html'
        };
    });
    app.directive('categoryList', function () {
        return {
            restrict: 'E',
            templateUrl: 'elements/category-list.html',
            controller: function ($scope) {
                $scope.categories = function () {
                    return Object.getOwnPropertyNames(homepage.catmap);
                };
            }
        };
    });
    app.directive('problemList', function () {
        return {
            restrict: 'E',
            templateUrl: 'elements/problem-list.html',
            controller: function ($scope) {
            }
        };
    });

    /***************************************************
     * APIGEE Client
     ****************************************************/

    var client = new Apigee.Client({
        orgName: 'sdipu',
        appName: 'problemsolvinglist'
    });

    function login(user) {
        client.login(user.username, user.password, function (error, res, user) {
            if (error) {
                displayMessage(error);
            }
            else {
                homepage.user = user._data;
                afterLogin();
            }
        });
    }

    function logout() {
        client.logout();
        afterLogout();
    }

    function update() {
        var $scope = homepage;
        var prop = {
            type: 'problems'
        };
        setTimeout(function () {
            client.getEntity(prop, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    $scope.problems = response.entities;
                    $scope.catmap = {};
                    for (var i = 0; i < $scope.problems.length; ++i) {
                        $scope.catmap[$scope.problems[i].category] = true;
                    }
                }
            });
        }, 100);
    }

    function afterLogin() {
        homepage.loggedIn = true;
        update();
    }

    function afterLogout() {
        homepage.user = {};
        homepage.problems = [];
        homepage.loggedIn = false; 
    }

})();

