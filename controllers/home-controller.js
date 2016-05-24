(function () {
    var problemListApp = angular.module('ProblemListApp', []);

    problemListApp.controller('HomePageController', function ($scope, $http) {
        $scope.config = getConfig();


    });

})();

function getConfig() {
    return {
        title: 'Problem Solving List',
        description: 'List of problems to solve',
        site_url: 'https://dipu-bd.github.io/problem-solving-list',
        site_image: 'assets/long-list.jpg'
    };
}