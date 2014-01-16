'use strict';

angular.module( 'app.controllers' )
  .controller( 'SignupCtrl',
    function ( $scope, $rootScope, $location, $q, FirebaseAuthenticate, FirebaseProfile, $log ) {
      // *********************************************
      // Private functions and variables
      // *********************************************
      var errorLogic;

      errorLogic = {
        'INVALID_EMAIL': { msg: 'Please provide a valid email address', clearFields: ['email', 'password'] },
        'INVALID_PASSWORD': { msg: 'Please provide a valid password', clearFields: ['password'] },
        'INVALID_USER': { msg: 'Please provide a valid email address', clearFields: ['email', 'password'] },
        'EMAIL_TAKEN': { msg: 'Email already in use. Please try again', clearFields: ['email', 'password'] }
      };

      function clearField ( fieldName ) {
        $scope.data[fieldName] = undefined;
      }

      function handleAccountCreationError ( error ) {
        var eLogic = errorLogic[error.code];
        angular.forEach ( eLogic.clearFields, function ( fieldName ){
          clearField( fieldName );
        } );
        $scope.data.errorMessage = eLogic.msg;
        $scope.data.loading = false;
      }

      // Stub error handler
      function handlLoginError ( error ) {
        $log.log( error );
      }

      // Stub error handler
      function handleProfileCreationError ( error ) {
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
          case 'account_creation':
            handleAccountCreationError( error );
            break;
          case 'login':
            handlLoginError( error );
            break;
          case 'profile_creation':
            handleProfileCreationError( error );
            break;
          default:
            $log.log( 'Error - stage processing error' );
          }
        }
        // Return a rejected promise  with error of 'processed' (required for chained promises)
        return $q.reject( 'processed' );
      }

      function onSignupComplete ( ) {
        $location.path( '/' );
      }

      // *********************************************
      // Public methods
      // *********************************************

      // Signup event handler
      $scope.signup = function ( email, password ) {

        $scope.data.errorMessage = undefined;
        $scope.data.loading = true;

        var userData = { email: email, password: password, rememberMe: true };

        // Error handler functions
        var createAccountErrror = function ( error ) { return raiseError( error, 'account_creation' ); };
        var loginError = function ( error ) { return raiseError( error, 'login' ); };
        var createProfileError = function ( error ) { return raiseError( error, 'profile_creation' ); };

        // Run signup process
        FirebaseAuthenticate.createAccount( userData )
          .then( FirebaseAuthenticate.login.bind( FirebaseAuthenticate ), createAccountErrror )
          .then( FirebaseProfile.create.bind( FirebaseProfile ), loginError )
          .then( onSignupComplete, createProfileError );
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
      if ( $rootScope.auth && $rootScope.auth.user ) {
        $location.path( '/' );
      }

    }
  );  //End controller
