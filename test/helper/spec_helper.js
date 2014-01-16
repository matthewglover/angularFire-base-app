'use strict';

( function ( ) {

  var obj = {};

  obj.stub = function ( ) {
    var out = { };
    angular.forEach( arguments, function ( m ) {
      out[m] = function( ) { };
    } );
    return out;
  };

  obj.reject = function ( $q, $timeout, error ) {
    var def = $q.defer();
    $timeout( function ( ) {
      def.reject( error );
    }, 1000 );
    return def.promise;
  };

  obj.resolve = function ( $q, $timeout, val ) {
    var def = $q.defer();
    $timeout( function ( ) {
      def.resolve( val );
    }, 1000 );
    return def.promise;
  };


  window.SpecHelper = obj;
} )();