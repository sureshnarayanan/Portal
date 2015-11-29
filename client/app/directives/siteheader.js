var appName = 'PortalApp';

angular.module(appName).directive('siteheader',function(){
  return {
    restrict: 'A', //This means that it will be used as an attribute and NOT as an element.
    templateUrl: "views/partials/siteheader.html"
  }
});
// .directive('onKeyPressCall', function () {
//     return function (scope, element, attrs) {
//         element.bind("keydown keypress", function (event) {
//                 scope.$apply(function (){
//                     scope.$eval(attrs.ngEnter);
//                 });
//                 event.preventDefault();
//         });
//     };
// });
