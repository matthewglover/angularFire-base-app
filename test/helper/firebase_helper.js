/*exported fBase */
'use strict';

var fBase = {
  // Set helpers
  customSpy: function ( obj, m, fn ) {
    obj[m] = fn;
    spyOn( obj, m ).andCallThrough( );
  },

  stub: function ( ) {
    var out = { };
    angular.forEach ( arguments, function ( m ) {
      out[m] = jasmine.createSpy();
    } );
    return out;
  },

  // firebaseStub: function  ( ) {
  //   // firebase is invoked using new Firebase, but we need a static ref
  //   // to the functions before it is instantiated, so we cheat here by
  //   // attaching the functions as Firebase.fns, and ignore new (we don't use `this` or `prototype`)
  //   var FirebaseStub = function() {
  //     return FirebaseStub.fns;
  //   };
  //   FirebaseStub.fns = { callbackVal: null };
  //   FirebaseStub.fns.snapshot = { val: function ( ) { return { data: 'dummy' }; } };
  //   this.customSpy( FirebaseStub.fns, 'set', function ( value, cb ) { if ( cb ) { cb( FirebaseStub.fns.callbackVal ); } } );
  //   this.customSpy( FirebaseStub.fns, 'once', function ( value, cb ) { if ( cb ) { cb( FirebaseStub.fns.snapshot ); } } );
  //   this.customSpy( FirebaseStub.fns, 'child', function() { return FirebaseStub.fns; } );
  //   return FirebaseStub;
  // },

  stubFirebaseAuthenticate: function ( ) {
    // return FirebaseAuthenticate;
    var api = this.stub( 'getAuth', 'createAccount' );
    // this.customSpy( api, 'createAccount', function ( ) { return null; } );
    return api;
  },

  angularAuthStub: function () {
    function AuthStub() { return AuthStub.fns; }
    AuthStub.fns = this.stub('$login', '$logout');
    return AuthStub;
  },

  reject: function ( $q, error ) {
    var def = $q.defer();
    def.reject( error );
    return def.promise;
  },

  resolve: function ( $q, val ) {
    var def = $q.defer();
    def.resolve( val );
    return def.promise;
  },

  flush: function ($timeout) {
    try { $timeout.flush(); }
    catch( e ) { } // is okay
  }

  //MG custom functions



};