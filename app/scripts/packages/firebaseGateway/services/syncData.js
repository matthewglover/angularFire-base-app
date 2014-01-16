'use strict';

angular.module( 'packages.firebaseGateway.services')
  .factory( 'syncData',
    function ( $firebase, firebaseRef ) {

      //**********************************************
      // Declare private functions and variables
      //**********************************************

      //**********************************************
      // Declare and return function
      //**********************************************
      return function ( path, limit ) {
        var ref = firebaseRef( path );
        if ( limit ) {
          ref = ref.limit( limit );
        }
        return $firebase( ref );
      };
    }
  );
