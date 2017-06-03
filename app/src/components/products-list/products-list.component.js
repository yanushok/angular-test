(function() {
    'use strict';
    
    angular
        .module('app.components.productsList', ['app.services'])
        .component('productsList', {
            templateUrl: 'src/components/products-list/products-list.template.html',
            controller: productsListController,
            bindings: {
                category: '@',
                sortProp: '@',
                odd: '@'
            }
        });

    productsListController.$inject = ['$timeout', '$location', 'Product'];

    function productsListController($timeout, $location, Product) {
        var $ctrl = this;

        $ctrl.products = [];
        
        $ctrl.settings = {
            dots: true,
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ],
            event: {
                init: function(event, slick) {
                    getAllPagesCount($ctrl, slick, slick.activeBreakpoint);
                },
                breakpoint: function(event, slick, breakpoint) {
                    getAllPagesCount($ctrl, slick, breakpoint);
                }
            }
        }

        $ctrl.push = function(id) {
            var url = '/product/' + id;
            $location.url(url);
        }

        $ctrl.$onInit = function() {
            Product.query(function(res) {
                $ctrl.products = res[$ctrl.category];
                $ctrl.allPages = Math.ceil($ctrl.products.length / 3);
            });
        };
        

        $ctrl.$onChanges = function(changesObj) {
            $ctrl.isOdd = $ctrl.odd === 'true' ? true : false;

            var temp = $ctrl.products;
            
            // массив обнуляется чтобы slick переинициализировался при появлении новых элементов
            $ctrl.products = [];

            $timeout(function() {
                $ctrl.products = temp;
            }, 0);
        };

        // $ctrl.$onDestroy = function() { };
    }

    function getAllPagesCount(context, slick, breakpoint) {
        if (breakpoint == 768) {
            context.allPages = slick.slideCount;
        } else if (breakpoint == 1200) {
            context.allPages = Math.ceil(slick.slideCount / 2);
        } else {
            context.allPages = Math.ceil(slick.slideCount / 3);
        }
    };
})();