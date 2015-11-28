angular.module('PortalApp')
  .factory('Useraccount', function($resource) {
    return $resource('/api/useraccounts/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });
}).service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});
