angular.module('PortalApp').controller('SearchController', function($scope,$stateParams,$window,searchclient) {

  if(angular.isDefined($stateParams.origquery))
  {
    $scope.isreplacedsearchterm = 1;
    $scope.origquery = $stateParams.origquery;
  }
$scope.searchterm = $stateParams.query;
// search for documents
if(angular.isDefined($stateParams.query))
{
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
    "suggest":
        {
        "text" : $stateParams.query,
        "suggest1": {
            "term" : {
            "size" : 1,
            "field" : "name"
            }
          },
          "suggest2": {
              "term" : {
              "size" : 1,
              "field" : "description"
              }
            }
        }
    }

    }).then(function (response) {
      //return response.hits.hits;
      $scope.hits = response.hits.hits;
      //If 0 hits then may be suggest for better search term to user
      if(response.hits.hits.length==0)
      {
        if(response.suggest.suggest1[0].options.length>0)
          $scope.suggest = response.suggest.suggest1[0].options[0]['text'];
        else if(response.suggest.suggest2[0].options.length>0)
          $scope.suggest = response.suggest.suggest2[0].options[0]['text'];
        if(angular.isDefined($scope.suggest))
        $window.location.href = '/#/search?origquery=' + $scope.searchterm + '&query='+$scope.suggest;
        else $scope.noresults = 1;
      }
    });
};
});
