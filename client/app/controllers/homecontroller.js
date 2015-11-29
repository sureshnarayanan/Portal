angular.module('PortalApp').controller('HomeController', function($scope, $auth) {

	$scope.tagline = 'Welcome to the Home Page!';
	$scope.isAuthenticated = function() {
	      return $auth.isAuthenticated();
	    };

	$scope.search = function() {
		$http({method: 'GET', url: '/#/search'}).
						success(function(data, status, headers, config) {
 						$scope.results.push(data);  //retrieve results and add to existing results
						});
			    };
});
