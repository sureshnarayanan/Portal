angular.module('PortalApp').controller('VendorController', function($scope,$state,popupService,$window,Vendor) {

  $scope.vendors=Vendor.query();

    $scope.deleteVendor=function(Vendor){
        if(popupService.showPopup('Really delete this?')){
            Vendor.$delete(function(){
                $window.location.href='/#/vendors';
            });
        }
    }

}).controller('VendorViewController',function($scope,$stateParams,Vendor){

    $scope.vendor=Vendor.get({id:$stateParams.id});

}).controller('VendorCreateController',function($scope,$state,$stateParams,Vendor){

    $scope.vendor=new Vendor();

    $scope.addVendor=function(){
        $scope.vendor.$save(function(){
            $state.go('vendors');
        });
    }

}).controller('VendorEditController',function($scope,$state,$stateParams,Vendor){

    $scope.updateVendor=function(){
        $scope.vendor.$update(function(){
            $state.go('vendors');
        });
    };

    $scope.loadVendor=function(){
        $scope.vendor=Vendor.get({id:$stateParams.id});
    };

    $scope.loadVendor();
});
