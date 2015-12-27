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

    console.log('VendorEditController called');
    $scope.updateVendor=function(){
      console.log('updateVendor called');
        $scope.vendor.$update(function(){
            $state.go('vendors');
        });
    };
    var vm = this;
    vm.submit = function(){ //function to call on form submit
      console.log('Submite medhod called');
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }

    $scope.upload = function (file) {
      console.log("upload method");
      //debugger;
        Upload.upload({
            url: 'http://localhost:8080/api/vendors/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

    $scope.loadVendor=function(){
        $scope.vendor=Vendor.get({id:$stateParams.id});
    };

    $scope.loadVendor();

});
