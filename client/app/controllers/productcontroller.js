angular.module('PortalApp').controller('ProductGetAllController',function($scope,$stateParams,Product){

    $scope.products=Product.query();

    $scope.deleteProduct=function(Product){
        if(popupService.showPopup('Really delete this?')){
            Product.$delete(function(){
                $window.location.href='/#/getallproduct';
            });
        }
    }

}).controller('ProductGetController',function($scope,$stateParams,Product){

    $scope.product=Product.get({id:$stateParams.id});

}).controller('ProductCreateController',function($scope,$state,$stateParams,Product){

    $scope.product=new Product();

    $scope.addProduct=function(){
        $scope.vendor.$save(function(){
            $state.go('products');
        });
    }

}).controller('ProductUpdateController',function($scope,$state,$stateParams,Product){

    $scope.updateProduct=function(){
        $scope.vendor.$update(function(){
            $state.go('products');
        });
    };

    $scope.loadProduct=function(){
        $scope.product=Product.get({id:$stateParams.id});
    };

    $scope.loadProduct();
});
