'use strict';

angular.module( 'packages.firebaseGateway.services')
  .factory( 'firebaseRef',
    function ( Firebase, FBURL ) {

      //**********************************************
      // Declare private functions and variables
      //**********************************************
      function pathRef ( args ) {
        for( var i = 0, n = args.length; i < n; i++ ) {
          if ( typeof( args[i] ) === 'object' ) {
            args[i] = pathRef( args[i] );
          }
        }
        return args.join('/');
      }

      //**********************************************
      // Declare and return function
      //**********************************************
      return function ( ) {
        return new Firebase( pathRef( [ FBURL ].concat( Array.prototype.slice.call( arguments ) ) ) );
      };

    }
  );
