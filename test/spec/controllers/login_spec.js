/*jshint -W087 */
/*global FirebaseAuthenticateMock */
/*global FirebaseProfileMock */

'use strict';

describe( 'LoginCtrl', function ( ) {

  // ##################################################################
  // test suite configuration
  // ##################################################################
  var $scope, Ctrl, data;

  beforeEach( module( 'app.controllers' ) );

  // Mock out FirebaseAuthenticate Service
  beforeEach( module( function ( $provide ) {
    $provide.factory( 'FirebaseAuthenticate', FirebaseAuthenticateMock );
    $provide.factory( 'FirebaseProfile', FirebaseProfileMock );
  } ) );

  // Create SignupCtrl instance
  beforeEach( inject( function ( $controller, $rootScope ) {
    $scope = $rootScope.$new();
    Ctrl = $controller('LoginCtrl', { $scope: $scope } );
  } ) );

  // ##################################################################
  // default controller tests
  // ##################################################################
  describe( 'default controller state', function ( ) {

    it( 'should not be loading', function ( ) {
      expect( $scope.data.loading ).toBe( false );
    } );

    it( 'should not have an error message', function ( ) {
      expect( $scope.data.errorMessage ).toBe( undefined );
    });
  } );

  // Set default data ( n.b. these should match mocks valid data )
  beforeEach ( function ( ) {
    data = { email: 'test@testing.com', password: 'foobar' };
  } );

 // ##################################################################
  // #login method tests
  // ##################################################################
  describe( '#login', function ( ) {

    it( 'should set loading to true', inject ( function( $timeout ) {
      $scope.login( data.email, data.password );
      $timeout.flush();
      expect( $scope.data.loading ).toBe( true );
    } ) );

    it( 'should call FirebaseAuthenticate.login with email and password',
      inject( function ( FirebaseAuthenticate, $timeout ) {
        spyOn( FirebaseAuthenticate, 'login' ).andCallThrough();
        $scope.login( data.email, data.password );
        $timeout.flush();
        expect( FirebaseAuthenticate.login ).toHaveBeenCalledWith(
          { email: data.email, password: data.password, rememberMe: true } );
      }
    ) );

    it( 'should stop loading and set an error when email is incorrect',
      inject( function ( $timeout ) {
        data.email = 'wrong@testing.com';
        $scope.login( data.email, data.password );
        $timeout.flush();
        expect( $scope.data.loading ).toBe( false );
        expect( $scope.data.errorMessage ).toBe( 'Please provide a valid email address' );
      }
    ) );

    it( 'should stop loading and set an error when password is incorrect',
      inject( function ( $timeout ) {
        data.password = 'wrongpassword';
        $scope.login( data.email, data.password );
        $timeout.flush();
        expect( $scope.data.loading ).toBe( false );
        expect( $scope.data.errorMessage ).toBe( 'Please provide a valid password' );
      }
    ) );

    it( 'should attempt to find or create profile after successful login',
      inject( function ( FirebaseProfile, $timeout ) {
        spyOn( FirebaseProfile, 'findOrCreate' ).andCallThrough();
        $scope.login( data.email, data.password );
        $timeout.flush();
        expect( FirebaseProfile.findOrCreate ).toHaveBeenCalledWith( { email: data.email, password: data.password, rememberMe: true } );
      }
    ) );

    it( 'should reject promise if findOrCreate fails',
      inject( function ( FirebaseProfile, $timeout, $q ) {
        spyOn( FirebaseProfile, 'findOrCreate' ).andCallFake( function ( ) {
          var def = $q.defer();
          $timeout( function ( ) {
            def.reject( { msg: 'Error message' } );
          }, 1000 );
          return def.promise;
        } );
        $scope.login( data.email, data.password );
        $timeout.flush();
        $timeout.flush();
        expect( $scope.error.msg ).toBe( 'Error message' );
      })
    );

    it( 'should attempt to change $location.path to \'/\' ',
      inject( function ( $location, $timeout ) {
        spyOn( $location, 'path' );
        $scope.login( data.email, data.password );
        $timeout.flush();
        $timeout.flush();
        expect( $location.path ).toHaveBeenCalledWith( '/' );
      } )
    );
  } );  // #login

} );
