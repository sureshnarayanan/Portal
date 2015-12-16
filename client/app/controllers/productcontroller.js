angular.module('PortalApp').controller('ProductGetAllController',function($scope,$state,popupService,$window,Product){

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

    $scope.deleteProduct=function(Product){
        if(popupService.showPopup('Really delete this?')){
            Product.$delete(function(){
                $window.location.href='/#/getallproduct';
            });
        }
    }
    
    $scope.deleteProductById=function(Product){
        if(popupService.showPopup('Really delete this?')){
            $scope.product.$delete(function(){
                $window.location.href='/#/getallproduct';
            });
        }
    }

}).controller('ProductCreateController',function($scope,$state,$stateParams,Product){

    $scope.product=new Product();

    $scope.addProduct=function(){
        $scope.product.$save(function(){
            $state.go('getallproduct');
        });
    }

}).controller('ProductUpdateController',function($scope,$state,$stateParams,Product){

    $scope.updateProduct=function(){
        $scope.product.$update(function(){
            $state.go('getallproduct');
        });
    };

    $scope.loadProduct=function(){
        $scope.product=Product.get({id:$stateParams.id});
    };

    $scope.loadProduct();
});
