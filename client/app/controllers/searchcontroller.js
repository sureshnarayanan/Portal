angular.module('PortalApp').controller('SearchController', function($scope,$stateParams, searchclient) {

// search for documents
    searchclient.search({
    index: 'vendor-1',
    type: 'products',
    size: 50,
    body: {
    "query":
        {
            "query_string": {
               "query": "*" + $stateParams.query + "*",
                "fields":["name","description"]
            }
        },
    }

    }).then(function (response) {
      //return response.hits.hits;
      $scope.hits = response.hits.hits;
    });

});
