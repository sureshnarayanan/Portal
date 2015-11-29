angular.module('PortalApp').controller('HomeController', function($scope, $auth, $window) {

	$scope.tagline = 'Welcome to the Home Page!';
	$scope.isAuthenticated = function() {
	      return $auth.isAuthenticated();
	    };

	$scope.search = function() {
		$window.location.href = '/#/search?query='+$scope.searchtext;
	};
});
