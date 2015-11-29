angular.module('PortalApp').controller('UseraccountController', function($scope,$state,popupService,$window,Useraccount) {

  $scope.useraccounts=Useraccount.query();

      $scope.deleteUseraccount=function(Useraccount){
          if(popupService.showPopup('Really delete this?')){
              Useraccount.$delete(function(){
                  $window.location.href='/#/useraccounts';
              });
          }
      }

  }).controller('UseraccountViewController',function($scope,$stateParams,Useraccount){

      $scope.useraccount=Useraccount.get({id:$stateParams.id});

  }).controller('UseraccountEditController',function($scope,$state,$stateParams,Useraccount){

      $scope.updateUseraccount=function(){
          $scope.useraccount.$update(function(){
              $state.go('useraccounts');
          });
      };

      $scope.loadUseraccount=function(){
          $scope.useraccount=Useraccount.get({id:$stateParams.id});
      };

      $scope.loadUseraccount();
});
