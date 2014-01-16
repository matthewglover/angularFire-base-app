
'use strict';

angular.module( 'app.controllers', [] );

// Declare app module
angular.module( 'myApp',
  [
    'ngRoute',
    'firebase',
    'packages.firebaseGateway.services',
    'waitForAuth',
    'app.controllers'
  ]
)

  // Set default path config
  .config( function ( $routeProvider ) {
    $routeProvider
      .when( '/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        authRequired: true
      })
      .when('/data', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        authRequired: true
      })
      .when( '/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when( '/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
  )

  // Create Firebase url reference
  .constant( 'FBURL', 'https://thinkster-firebase-tutorial-123.firebaseio.com/' )

  // Create default path when authentication fails
  .constant( 'AUTH_PATH', '/login' )

  .run( function ( $rootScope, syncData ) {
    $rootScope.$on( '$firebaseAuth:login', function ( event, user ) {
      $rootScope.user = syncData ( ['users', user.uid] );
    });

    $rootScope.$on( '$firebaseAuth:logout', function ( ) {
      $rootScope.user = undefined;
    });
  });
