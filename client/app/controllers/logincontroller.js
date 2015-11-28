angular.module('PortalApp')
  .controller('LoginController', function($scope, $location, $auth, toastr, Account) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
        //  toastr.success('You have successfully signed in');          
          $location.path('/');
        })
        .catch(function(response) {
          toastr.error(response.data.message);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          toastr.success('You have successfully signed in with ' + provider);
          $location.path('/');
        })
        .catch(function(response) {
          toastr.error(response.data.message);
        });
    };
    $scope.signup = function() {
    $auth.signup($scope.user)
      .then(function(response) {
        $auth.setToken(response);
        $location.path('/');
      //  toastr.info('You have successfully created a new account and have been signed-in');
      })
      .catch(function(response) {
        toastr.error(response.data.message);
      });
  };

});
