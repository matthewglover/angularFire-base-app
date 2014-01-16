/*exported FirebaseProfileMock */
'use strict';

function FirebaseProfileMock ( $q, $timeout ) {
  // var validData = { email: 'test@testing.com', password: 'foobar' };

  return {
    create: function ( user ) {
      var def = $q.defer();
      $timeout( function ( ) {
        def.resolve( user );
      }, 1000 );
      return def.promise;
    },
    find: function ( user ) {
      var def = $q.defer();
      $timeout( function ( ) {
        def.resolve( user );
      }, 1000 );
      return def.promise;
    },
    findOrCreate: function ( user ) {
      var def = $q.defer();
      $timeout( function ( ) {
        def.resolve( user );
      }, 1000 );
      return def.promise;
    }
  };
}