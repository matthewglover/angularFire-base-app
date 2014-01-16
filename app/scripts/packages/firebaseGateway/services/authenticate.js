'use strict';

angular.module( 'packages.firebaseGateway.services')
  .factory( 'FirebaseAuthenticate',
    function ( $firebaseAuth, firebaseRef, AUTH_PATH, $q ) {
      //**********************************************
      // Declare private functions and variables
      //**********************************************
      var auth = $firebaseAuth( firebaseRef(), { path: AUTH_PATH } );

      //**********************************************
      // Declare and return api
      //**********************************************
      return {

        getAuth: function ( ) {
          return auth;
        },

        login: function ( user ) {
          var def = $q.defer();
          var successHandler = function ( user ) { return def.resolve( user ); };
          var errorHandler = function ( error ) { return def.reject( error ); };
          auth.$login( 'password', user )
            .then( successHandler, errorHandler );
          return def.promise;
        },

        logout: function ( ) {
          auth.$logout();
        },

        createAccount: function ( user ) {
          var def = $q.defer();
          function callback ( error ) {
            if ( error ) {
              def.reject( error );
            } else {
              def.resolve( user );
            }
          }
          auth.$createUser( user.email, user.password, callback );
          return def.promise;
        }

      }; //End api object

    }
  );
