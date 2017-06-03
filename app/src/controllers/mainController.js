(function() {
    'use strict';

    angular
        .module('app.controllers.mainController', [])
        .controller('mainController', mainController);

    mainController.$inject = [];

    function mainController() {        
        var vm = this;
        
        vm.categories = {
            men: true,
            women: false,
            children: true
        };

        vm.seeAllProducts = function() {
            for (var key in vm.categories) {
                vm.categories[key] = true;
            }
        }
    }
})();