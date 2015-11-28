var appName = 'PortalApp';

var module = angular.module(appName, ['ngResource','ngMessages', 'ngAnimate', 'toastr', 'ui.router', 'satellizer', 'ui.bootstrap']);

angular.element(document).ready(function() {
//    angular.bootstrap(document, [appName]);
});

module.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    positionClass: 'toast-bottom-right',
    progressBar: "true"
  });
});
