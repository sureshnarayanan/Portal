angular.module('PortalApp').controller('UseraccountController', function($scope,$state,popupService,$window,Useraccount) {

  $scope.useraccounts=Useraccount.query();

});
