'use strict';

angular.module( 'app.controllers' )
  .controller( 'LoginCtrl',
    function ( $scope, $rootScope, $location, FirebaseAuthenticate, FirebaseProfile, $log, $q ) {
      // *********************************************
      // Private functions
      // *********************************************

      var errorLogic = {
        'INVALID_EMAIL': { msg: 'Please provide a valid email address', clearFields: ['email', 'password'] },
        'INVALID_PASSWORD': { msg: 'Please provide a valid password', clearFields: ['password'] },
        'INVALID_USER': { msg: 'Please provide a valid email address', clearFields: ['email', 'password'] }
      };

      function clearField ( fieldName ) {
        $scope.data[fieldName] = undefined;
      }

      function loginErrorHandler ( error ) {
        var eLogic = errorLogic[error.code];
        angular.forEach ( eLogic.clearFields, function ( fieldName ) {
          clearField( fieldName );
        } );
        $scope.data.errorMessage = eLogic.msg;
        $scope.data.loading = false;
      }

      // Stub error handler
      function findOrCreateErrorHandler ( error ) {
        $log.log( error );
      }

      function logError ( error, errorStage ) {
        $scope.error = error;
        $scope.errorStage = errorStage;
      }

      function raiseError ( error, errorStage ) {
        // Only capture unprocessed errors
        if ( error !== 'processed' ) {
          logError( error, errorStage );
          switch ( errorStage ) {
          case 'login_error':
            loginErrorHandler( error );
            break;
          case 'findOrCreate_error':
            findOrCreateErrorHandler( error );
            break;
          default:
            $log.log( 'Error - stage processing error' );
          }
        }
        // Return a rejected promise  with error of 'processed' (required for chained promises)
        return $q.reject( 'processed' );
      }

      function onLoginComplete ( ) {
        $location.path( '/' );
      }

      // *********************************************
      // Public methods
      // *********************************************


      // Login event handler
      $scope.login = function ( email, password ) {

        $scope.data.errorMessage = undefined;
        $scope.data.loading = true;

        var loginData = { email: email, password: password, rememberMe: true };

        // Error handler functions
        var loginError = function ( error ) { return raiseError( error, 'login_error' ); };
        var findOrCreateError = function ( error ) { return raiseError( error, 'findOrCreate_error' ); };

        // Run login process
        FirebaseAuthenticate.login( loginData )
          .then( FirebaseProfile.findOrCreate.bind( FirebaseProfile ), loginError )
          .then( onLoginComplete, findOrCreateError );
      };

      $scope.clearErrorMsgs = function ( ) {
        $scope.data.errorMessage = undefined;
      };

      // *********************************************
      // Configuration
      // *********************************************
      $scope.data = {};
      $scope.data.loading = false;


      // *********************************************
      // Initialisation
      // *********************************************
 
      // Redirect if user is already logged in
      if ( $rootScope.auth && $rootScope.auth.user ) {
        $location.path( '/' );
      }

    }
  );  //End controller
