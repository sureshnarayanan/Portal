angular.module('PortalApp').controller('SearchController', function($scope, searchclient) {

// search for documents
    searchclient.search({
    index: 'vendor-1',
    type: 'products',
    size: 50,
    body: {
    "query":
        {
            "match": {
                name:"ice"
            }
        },
    }

    }).then(function (response) {
      //return response.hits.hits;
      $scope.hits = response.hits.hits;
    });

});
