(function () {
    var APIGEE_ORGNAME = 'sdipu';
    var APIGEE_APPNAME = 'problemsolvinglist';

    /*********************************************************
     * ProblemListApp and
     * HomePageController
     **********************************************************/
    var problemListApp = angular.module('ProblemListApp', []);

    var homepage = {};

    problemListApp.controller('HomePageController', function ($scope) {
        homepage = $scope;
        $scope.config = getConfig();
        // download and show list of problems
        getProblems();
        getCategory();
    });

    /*********************************************************
     * APIGEE Client.
     * CRUD using apigee client
     **********************************************************/
    var client = new Apigee.Client({
        orgName: APIGEE_ORGNAME,
        appName: APIGEE_APPNAME
    });

    function getProblems() {
        var options = { 
            endpoint: "users", //the collection to query
            qs: {ql: "status='active'", limit: 5}
        };

        client.getEntity(options, function (error, data) {
            if(error) {
                console.log(error);
            }
            else {
                console.log(data);
            }
        });
    }

    function getCategory() {
        var client = getClient();
    }

    function addProblem(link, category) {
        var client = getClient();
    }

    function deleteProblem(problem) {
        var client = getClient();
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
