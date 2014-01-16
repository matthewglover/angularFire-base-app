/*exported FirebaseAuthenticateMock */
'use strict';

function FirebaseAuthenticateMock ( $q, $timeout, $log ) {
  var validData = { email: 'test@testing.com', password: 'foobar' };

  function isValid ( data ) {
    if ( data.email === validData.email &&
      data.password === validData.password ) {
      return true;
    }
    return false;
  }

  return {
 
    getAuth: function ( ) {
      $log.log ( 'You have called auth!!' );
      return null;
    },

    login: function ( data ) {
      var def = $q.defer();
      $timeout( function ( ) {
        if ( isValid( data ) ) { return def.resolve( data ); }
        if ( data.email !== validData.email ) { return def.reject( { code:'INVALID_EMAIL' } ); }
        if ( data.password !== validData.password ) { return def.reject( { code:'INVALID_PASSWORD' } ); }
        return def.resolve( validData );
      }, 1000 );
      return def.promise;
    },

    logout: function ( ) {
      $timeout( function ( ) {
        return 'logout succeed';
      } );
    },

    createAccount: function ( data ) {  // Approximates functionality, but doesn't enforce correct email/password rules
      var def = $q.defer();
      $timeout( function ( ) {
        if ( data.email !== validData.email ) { return def.reject( { code:'INVALID_EMAIL' } ); }
        if ( data.password !== validData.password ) { return def.reject( { code:'INVALID_PASSWORD' } ); }
        return def.resolve( validData );
      }, 1000 );
      return def.promise;
    }
  };
}