angular.module('PortalApp')
.config(function($stateProvider, $urlRouterProvider, $authProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        controller: 'HomeController',
        templateUrl: 'views/home.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/user/login.html',
        controller: 'LoginController',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/user/signup.html',
        controller: 'LoginController',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('logout', {
        url: '/logout',
        controller: 'LogoutController'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileController',
        resolve: {
          loginRequired: loginRequired
        }
      }).state('search', {
        url: '/search?query',
        templateUrl: 'views/search/results.html',
        controller: 'SearchController'
      }).state('vendors', {
        url: '/vendors',
        templateUrl: 'views/vendors/list.html',
        controller: 'VendorController'
      }).state('viewVendor', {
        url: '/vendors/:id/view',
        templateUrl: 'views/vendors/view.html',
        controller: 'VendorViewController'
      }).state('createVendor', {
        url: '/vendors/create',
        templateUrl: 'views/vendors/create.html',
        controller: 'VendorCreateController'
      }).state('editVendor', {
        url: '/vendors/:id/edit',
        templateUrl: 'views/vendors/edit.html',
        controller: 'VendorEditController'
      }).state('useraccounts', {
        url: '/useraccounts',
        templateUrl: 'views/useraccounts/list.html',
        controller: 'UseraccountController'
      }).state('viewUseraccount', {
        url: '/useraccounts/:id/view',
        templateUrl: 'views/useraccounts/view.html',
        controller: 'UseraccountViewController'
      }).state('editUseraccount', {
        url: '/useraccounts/:id/edit',
        templateUrl: 'views/useraccounts/edit.html',
        controller: 'UseraccountEditController'
      });

    $urlRouterProvider.otherwise('/');

    $authProvider.facebook({
      clientId: '657854390977827'
    });

    $authProvider.google({
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
    });

    function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

  });
