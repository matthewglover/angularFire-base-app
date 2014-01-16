/*global FirebaseMock*/
'use strict';

describe( 'FirebaseProfile Service', function ( ) {

  var user;

  beforeEach( module( 'packages.firebaseGateway.services' ) );

  beforeEach( module( function ( $provide ) {
    $provide.factory( 'Firebase', FirebaseMock );
    $provide.value('firebaseRef', jasmine.createSpy( 'firebaseRef' ) );
    $provide.value( 'AUTH_PATH', '/login' );
  } ) );

  beforeEach( inject( function ( firebaseRef, Firebase) {
    firebaseRef.andCallFake( function ( ) {
      return Firebase;
    } );
  } ) );

  beforeEach( function ( ) {
    user = { uid: '1234', email: 'test@testing.com', password: 'password' };
  });

  describe( '#create', function ( ) {

    it( 'should call firebaseRef with path "users/:id"',
      inject( function ( Firebase, FirebaseProfile, firebaseRef ) {
        Firebase.mockHelper.mockSetSuccess( Firebase );
        FirebaseProfile.create( user );
        expect( firebaseRef ).toHaveBeenCalledWith( 'users/' + user.uid );
      }
    ) );

    it( 'should reject a promise and return an error if create fails',
      inject( function ( FirebaseProfile, Firebase, $timeout ) {
        var error = { msg: 'this is an error' };
        Firebase.mockHelper.mockSetError( Firebase, error );
        var resolvedValue;
        FirebaseProfile.create( user )
          .catch( function ( value ) { resolvedValue = value; } );
        $timeout.flush();
        expect( resolvedValue ).toBe( error );
      })
    );

    it( 'should resolve a promise and return the user profile if create succeeds',
      inject( function ( FirebaseProfile, Firebase, $timeout ) {
        Firebase.mockHelper.mockSetSuccess( Firebase );
        var resolvedValue;
        FirebaseProfile.create( user )
          .then( function ( value ) { resolvedValue = value; } );
        $timeout.flush();
        expect( resolvedValue.email ).toBe( user.email );
      })
    );
  }); // #create

  describe( '#find', function ( ) {
    it( 'should call firebase ref with path "users/:id',
      inject( function ( FirebaseProfile, Firebase, firebaseRef, $timeout ) {
        Firebase.mockHelper.mockOnceSuccess( Firebase, user );
        FirebaseProfile.find( user );
        $timeout.flush();
        expect( firebaseRef ).toHaveBeenCalledWith( 'users/' + user.uid );
      })
    );

    it( 'should reject a promise and return an error if find fails',
      inject( function ( FirebaseProfile, Firebase, $timeout ) {
        Firebase.mockHelper.mockOnceError( Firebase );
        var resolvedValue;
        FirebaseProfile.find( user )
          .catch( function errorHandler ( value ) { resolvedValue = value; } );
        $timeout.flush();
        expect( resolvedValue ).toBe( 'User ' + user.uid + ' not resolved' );
      })
    );

    it( 'should resolve a promise and return the user profile if find succeeds',
      inject( function ( FirebaseProfile, Firebase, $timeout ) {
        Firebase.mockHelper.mockOnceSuccess( Firebase, user );
        var resolvedValue;
        FirebaseProfile.find( user )
          .then( function ( value ) { resolvedValue = value; } );
        $timeout.flush();
        expect( resolvedValue.email ).toBe( user.email );
      })
    );
  }); // #find

  describe( '#findOrCreate', function ( ) {
    it( 'should call FirebaseProfile.find',
      inject( function ( FirebaseProfile ) {
        spyOn( FirebaseProfile, 'find' ).andCallThrough();
        FirebaseProfile.findOrCreate( user );
        expect( FirebaseProfile.find ).toHaveBeenCalledWith( user );
      })
    );

    it( 'should call FirebaseProfile.create if user profile not found',
      inject( function ( FirebaseProfile, Firebase, $timeout ) {
        Firebase.mockHelper.mockOnceError( Firebase );
        spyOn( FirebaseProfile, 'create' ).andCallThrough();
        FirebaseProfile.findOrCreate( user );
        $timeout.flush();
        expect( FirebaseProfile.create ).toHaveBeenCalledWith( user );
      })
    );

    it( 'should reject a promise and return an error on failure',
      inject( function ( FirebaseProfile, Firebase, $timeout  ) {
        Firebase.mockHelper.mockOnceError( Firebase );
        Firebase.mockHelper.mockSetError( Firebase, { msg: 'this is an error' } );
        var resolvedError;
        FirebaseProfile.findOrCreate( user )
          .catch( function ( error ) { resolvedError = error; } );
        $timeout.flush();
        $timeout.flush();
        expect( resolvedError.msg ).toBe( 'this is an error' );
      })
    );

    it( 'should resolve a promise and return the user profile on find success',
      inject( function ( FirebaseProfile, Firebase, $timeout  ) {
        Firebase.mockHelper.mockOnceSuccess( Firebase, user );
        var resolvedProfile;
        FirebaseProfile.findOrCreate( user )
          .then( function ( profile ) { resolvedProfile = profile; } );
        $timeout.flush();
        expect( resolvedProfile ).toBe( user );
      })
    );

    it( 'should resolve a promise and return the user profile on create success',
      inject( function ( FirebaseProfile, Firebase, $timeout  ) {
        Firebase.mockHelper.mockOnceError( Firebase );
        Firebase.mockHelper.mockSetSuccess( Firebase );
        var resolvedProfile;
        FirebaseProfile.findOrCreate( user )
          .then( function ( profile ) { resolvedProfile = profile; } );
        $timeout.flush();
        $timeout.flush();
        expect( resolvedProfile.email ).toBe( user.email );
      })
    );
  });
});
