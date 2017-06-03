(function() {
    'use strict';

    angular
        .module('app.controllers.productController', [])
        .controller('productController', productController);

    productController.$inject = ['$window', '$routeParams', 'Product'];
    function productController($window, $routeParams, Product) {
        var vm = this;
        vm.product = {};

        Product
            .get({ product_id: $routeParams.product_id })
            .$promise
            .then(function(res) {
                console.log(res);
                vm.product = res;
            })
            .catch(function(err) {
                if (err.status === 404) {
                    vm.backToMain();
                }
            });
        
        vm.backToMain = function() {
            $window.history.back();
        }
    }
})();