(function() {
    'use strict';

    var routes = angular.module('app.routes', ['ngRoute']);

    routes.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'src/views/home.html',
                controller: 'mainController',
                controllerAs: 'mainCtrl'
            })
            .when('/product/:product_id', {
                templateUrl: 'src/views/product.html',
                controller: 'productController',
                controllerAs: 'productCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
            

        // $locationProvider.html5Mode(true);
    }]);
})();