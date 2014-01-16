'use strict';

angular.module( 'app.controllers' )
  .controller( 'MainCtrl', function ( $scope,
    FirebaseAuthenticate, $rootScope, $location, AUTH_PATH ) {
    // *********************************************
    // Private functions
    // *********************************************


    // *********************************************
    // Public methods
    // *********************************************

    $scope.logout = function ( ) {
      FirebaseAuthenticate.logout();
    };

    // *********************************************
    // Configuration
    // *********************************************
    $scope.data = {};

    // When user logs out, redirect to the default authentication path
    $rootScope.$on('$firebaseAuth:logout', function( ) {
      $location.path( AUTH_PATH );
    });

    // *********************************************
    // Initialisation
    // *********************************************

  });  //End controller
