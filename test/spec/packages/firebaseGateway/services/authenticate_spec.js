/*global FirebaseMock*/
/*global $firebaseAuthMock*/
/*global SpecHelper*/
'use strict';

describe( 'FirebaseAuthenticate Service', function ( ) {
  var user;
  // Load app
  beforeEach( module( 'packages.firebaseGateway.services' ) );

  // Mock dependencies used by service to isolate testing
  beforeEach( module( function ($provide) {
    $provide.factory( 'Firebase', FirebaseMock );
    $provide.factory( '$firebaseAuth', $firebaseAuthMock );
    $provide.value('firebaseRef', jasmine.createSpy( 'firebaseRef' ) );
    $provide.value( 'AUTH_PATH', '/login' );
  } ) );

  beforeEach( inject( function ( firebaseRef, Firebase) {
    firebaseRef.andCallFake( function ( ) {
      return Firebase;
    } );
  } ) );

  beforeEach( function ( ) {
    user = { email: 'test@testing.com', password: 'password' };
  });

  describe( '#login', function ( ) {

    it( 'should reject promise if $firebaseAuth.$login fails',
      inject( function ( $q, $timeout, FirebaseAuthenticate, $firebaseAuth ) {
        spyOn( $firebaseAuth.fns, '$login' )
          .andReturn( SpecHelper.reject( $q, $timeout, 'test_error' ) );
        var resolvedValue;
        FirebaseAuthenticate.login( user.email, user.password )
          .catch( function ( value ) { resolvedValue = value; } );
        $timeout.flush();
        expect( resolvedValue ).toBe( 'test_error' );
      })
    );

    it( 'should resolve promise and return user if $firebaseAuth.$login succeeds',
      inject( function ( FirebaseAuthenticate, $firebaseAuth, $q, $timeout ) {
        spyOn( $firebaseAuth.fns, '$login' )
          .andReturn( SpecHelper.resolve( $q, $timeout, user ) );
        var resolvedValue;
        FirebaseAuthenticate.login( user )
          .then( function ( value ) { resolvedValue = value; } );
        $timeout.flush();
        expect( resolvedValue ).toBe( user );
      })
   );
  });

  describe('#logout', function() {
    it('should invoke $firebaseAuth.$logout()', function() {
      inject(function ( FirebaseAuthenticate, $firebaseAuth) {
        spyOn( $firebaseAuth.fns, '$logout' );
        FirebaseAuthenticate.getAuth();
        FirebaseAuthenticate.logout();
        expect($firebaseAuth.fns.$logout).toHaveBeenCalled();
      });
    });
  });

  describe( '#createAccount', function() {

    it( 'should invoke $firebaseAuth',
      inject( function ( FirebaseAuthenticate, $firebaseAuth ) {
        $firebaseAuth.mockHelper.mock$createUserSuccess( $firebaseAuth );
        FirebaseAuthenticate.getAuth();
        FirebaseAuthenticate.createAccount( user.email, user.password );
        expect( $firebaseAuth.fns.$createUser ).toHaveBeenCalled();
      })
    );

    it( 'should reject promise if error',
      inject( function ( FirebaseAuthenticate, $timeout, $firebaseAuth ) {
        var error = 'Error message';
        $firebaseAuth.mockHelper.mock$createUserError( $firebaseAuth, error );
        var resolvedValue;
        FirebaseAuthenticate.createAccount( user )
          .catch( function ( value ) { resolvedValue = value; } );
        $timeout.flush();
        expect( resolvedValue ).toBe( error );
      })
    );

    it ( 'should resolve promise if success',
      inject( function ( $firebaseAuth, FirebaseAuthenticate, $timeout ) {
        $firebaseAuth.mockHelper.mock$createUserSuccess( $firebaseAuth );
        var resolvedValue;
        FirebaseAuthenticate.createAccount( user )
          .then( function ( value ) { resolvedValue = value; } );
        $timeout.flush();
        expect( resolvedValue ).toBe( user );
      })
    );
  });

} );