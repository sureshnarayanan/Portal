angular.module('PortalApp').controller('UseraccountController', function($scope,$state,popupService,$window,Useraccount) {

  $scope.useraccounts=Useraccount.query();

      $scope.deleteUseraccounts=function(Useraccount){
          if(popupService.showPopup('Really delete this?')){
              Useraccount.$delete(function(){
                  $window.location.href='/#/useraccounts';
              });
          }
      }

  }).controller('UseraccountViewController',function($scope,$stateParams,Useraccount){

      $scope.useraccounts=Useraccount.get({id:$stateParams.id});

  }).controller('UseraccountEditController',function($scope,$state,$stateParams,Useraccount){

      $scope.updateUseraccounts=function(){
          $scope.useraccounts.$update(function(){
              $state.go('useraccounts');
          });
      };

      $scope.loadUseraccounts=function(){
          $scope.useraccounts=Useraccount.get({id:$stateParams.id});
      };

      $scope.loadUseraccounts();
});
