'use strict';

angular.module( 'packages.firebaseGateway.services')
  .factory( 'FirebaseProfile',
    function ( firebaseRef, $timeout, $q ) {

      //**********************************************
      // Declare private functions and variables
      //**********************************************

      function ucfirst ( str ) {
        // credits: http://kevin.vanzonneveld.net
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
      }

      function firstPartOfEmail ( email ) {
        return ucfirst(email.substr(0, email.indexOf('@'))||'');
      }

      function buildProfile ( user ) {
        var name = firstPartOfEmail( user.email );
        return {
          name: name,
          email: user.email
        };
      }

      //**********************************************
      // Declare and return api
      //**********************************************
      return {

        create: function ( user ) {
          var def = $q.defer();
          var profile = buildProfile( user );

          function callback ( error ) {
            if ( error ) {
              return def.reject( error );
            }
            return def.resolve( profile );
          }

          firebaseRef( 'users/' + user.uid ).set( profile, callback );
          return def.promise;
        },


        find: function ( user ) {
          var def = $q.defer();
          firebaseRef( 'users/' + user.uid ).once( 'value', function ( snapshot ) {
            var profile = snapshot.val();
            if ( profile ) {
              return def.resolve( profile );
            }
            return def.reject( 'User ' + user.uid + ' not resolved' );
          });
          return def.promise;
        },


        findOrCreate: function ( user ) {
          var that = this;
          var def = $q.defer();

          function handleSuccess ( profile ) {
            def.resolve( profile );
          }

          function handleCreateError ( error ) {
            that.errors.push( error );
            def.reject( error );
          }

          function handleNotFound ( ) {
            that.create( user )
              .then( handleSuccess, handleCreateError );
          }

          this.find( user )
            .then( handleSuccess, handleNotFound );

          return def.promise;
        },

        errors: []

      }; //End api object

    }
  );
