angular.module('PortalApp')
    .service('searchclient', function (esFactory) {
      return esFactory({
        host: 'localhost:9200'
      });
});
