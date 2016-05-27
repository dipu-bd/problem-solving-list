/***************************************************
 * APIGEE Client
 ****************************************************/
var APIGEE_CLIENT = {

    client: new Apigee.Client({
        orgName: 'sdipu',
        appName: 'problemsolvinglist'
    }),

    catmap: {},
    problems: [],
    loggedIn: false,

    login: function (user) {
        var $scope = this;
        client.login(user.username, user.password, function (error, res) {
            if (error) {
                displayMessage(error);
            }
            else {
                $scope.loggedIn = true;
                update();
            }
        });
    },

    logout: function () {
        client.logout();
        this.loggedIn = false;
        this.problems = [];
    },

    update: function () {
        var prop = {
            type: 'problems'
        };
        var $scope = this;
        setTimeout(function () {
            client.getEntity(prop, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    $scope.problems = response.entities;
                    $scope.catmap = {};
                    for(var i = 0; i < $scope.problems.length; ++i) {
                        $scope.catmap[$scope.problems[i].category] = true;
                    }
                }
            });
        }, 100);
    },

    categories: function () {
        return Object.getOwnPropertyNames(this.catmap);
    }
};

/***************************************************
 * ANGULAR controllers and directives
 ****************************************************/
(function () {

    var app = angular.module('ProblemListApp', []);

    var homepage = this;
    var apigee = new APIGEE_CLIENT();

    /***************************************************
     * HOME PAGE CONTROLLER
     ****************************************************/
    app.controller('IndexController', function ($scope) {
        homepage = $scope;
        $scope.config = getConfig();

        $scope.loggedIn = apigee.loggedIn;
        $scope.problems = apigee.problems;
        $scope.update = apigee.update;
    });

    /***************************************************
     * DIRECTIVES and CONTROLLERS
     ****************************************************/
    app.directive('loginForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'forms/login-form.html',
            controller: function ($scope) {
                $scope.login = apigee.login;
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
                $scope.logout = apigee.logout();
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
                $scope.categories = apigee.categories;
            }
        };
    });
    app.directive('problemList', function () {
        return {
            restrict: 'E',
            templateUrl: 'elements/problem-list.html',
            controller: function ($scope) {
                $scope.problems = apigee.problems;
            }
        };
    });

})();

