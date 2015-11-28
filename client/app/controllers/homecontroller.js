angular.module('PortalApp').controller('HomeController', function($scope, $auth) {

	$scope.tagline = 'Welcome to the Home Page!';
	$scope.isAuthenticated = function() {
	      return $auth.isAuthenticated();
	    };
});
