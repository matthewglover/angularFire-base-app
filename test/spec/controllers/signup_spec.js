/*jshint -W087 */
/*global FirebaseAuthenticateMock */
/*global FirebaseProfileMock */

'use strict';

describe( 'SignupCtrl', function ( ) {

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
    Ctrl = $controller('SignupCtrl', { $scope: $scope } );
  } ) );

  // Set default data ( n.b. these should match mocks valid data )
  beforeEach ( function ( ) {
    data = { email: 'test@testing.com', password: 'foobar', rememberMe: true };
  } );

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


  // ##################################################################
  // #signup method tests
  // ##################################################################
  describe( '#signup', function ( ) {

    it( 'should set loading to true', inject ( function( $timeout ) {
      $scope.signup( data.email, data.password );
      $timeout.flush();
      expect( $scope.data.loading ).toBe( true );
    } ) );

    it( 'should call FirebaseAuthenticate.createAccount with email and password',
      inject( function ( FirebaseAuthenticate, $timeout ) {
        spyOn( FirebaseAuthenticate, 'createAccount' ).andCallThrough();
        $scope.signup( data.email, data.password );
        $timeout.flush();
        expect( FirebaseAuthenticate.createAccount ).toHaveBeenCalledWith( data );
      }
    ) );

    it( 'should stop loading and set an error when email is incorrect',
      inject( function ( $timeout ) {
        data.email = 'wrong@testing.com';
        $scope.signup( data.email, data.password );
        $timeout.flush();
        expect( $scope.data.loading ).toBe( false );
        expect( $scope.data.errorMessage ).toBe( 'Please provide a valid email address' );
      }
    ) );

    it( 'should stop loading and set an error when password is incorrect',
      inject( function ( $timeout ) {
        data.password = 'wrongpassword';
        $scope.signup( data.email, data.password );
        $timeout.flush();
        expect( $scope.data.loading ).toBe( false );
        expect( $scope.data.errorMessage ).toBe( 'Please provide a valid password' );
      }
    ) );

    it( 'should attempt login after successful account creation',
      inject( function ( FirebaseAuthenticate, $timeout) {
        spyOn( FirebaseAuthenticate, 'login' );
        $scope.signup( data.email, data.password );
        $timeout.flush();
        expect( FirebaseAuthenticate.login ).toHaveBeenCalledWith( { email: data.email, password: data.password } );
      }
    ) );

    it( 'should attempt profile creation after successful login',
      inject( function ( FirebaseProfile, $timeout ) {
        spyOn( FirebaseProfile, 'create' );
        $scope.signup( data.email, data.password );
        $timeout.flush();
        $timeout.flush();
        expect( FirebaseProfile.create ).toHaveBeenCalledWith( { email: data.email, password: data.password } );
      })
    );

    it( 'should raise error at errorStage \'account_creation\' when email is invalid',
      inject( function ( FirebaseAuthenticate, $timeout ) {
        data.email = 'wrong@testing.com';
        $scope.signup( data.email, data.password );
        $timeout.flush();
        expect( $scope.errorStage ).toBe( 'account_creation' );
      }
    ) );

    it( 'should raise error at errorStage \'login\' when login fails',
      inject( function ( FirebaseAuthenticate, $timeout, $q ) {
        spyOn( FirebaseAuthenticate, 'login' ).andCallFake( function ( ) {
          var def = $q.defer();
          $timeout( function ( ) {
            def.reject( {} );
          } );
          return def.promise;
        } );
        $scope.signup( data.email, data.password );
        $timeout.flush();
        expect( $scope.errorStage ).toBe( 'login' );
      }
    ) );

    it( 'should raise error at errorStage \'profile_creation\' when profile creation fails',
      inject( function ( FirebaseProfile, $timeout, $q ) {
        spyOn( FirebaseProfile, 'create' ).andCallFake( function ( ) {
          var def = $q.defer();
          $timeout( function ( ) {
            def.reject( {} );
          } );
          return def.promise;
        } );
        $scope.signup( data.email, data.password );
        $timeout.flush();
        $timeout.flush();
        expect( $scope.errorStage ).toBe( 'profile_creation' );
      }
    ) );

    it( 'should attempt to change $location.path to \'/\' ',
      inject( function ( $location, $timeout ) {
        spyOn( $location, 'path' );
        $scope.signup( data.email, data.password );
        $timeout.flush();
        $timeout.flush();
        $timeout.flush();
        expect( $location.path ).toHaveBeenCalledWith( '/' );
      }
    ) );

  } );  // #signup

} );  // SignupCtrl
