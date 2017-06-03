(function() {
    'use strict';

    angular
        .module('app.services.product', ['ngResource'])
        .factory('Product', Product);

    Product.$inject = ['$resource'];

    function Product($resource) {
        return $resource('src/clothes/:product_id.json', {}, {
            query: {
                method: 'GET',
                params: { product_id: 'clothes'}
            }
        });
    }
})();