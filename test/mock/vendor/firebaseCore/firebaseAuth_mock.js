/*global SpecHelper */
/*exported $firebaseAuthMock */
'use strict';

function $firebaseAuthMock ( $timeout ) {

  var fn = function ( ) { return fn.fns; };

  fn.fns = SpecHelper.stub( '$login', '$logout', '$createUser' );

  fn.mockHelper = {

    mock$createUserSuccess: function ( objRef ) {
      spyOn( objRef.fns, '$createUser' )
        .andCallFake( function ( eml, pass, cb ) {
          $timeout( function ( ) {
            cb( null );
          }, 1000 );
        } );
    },

    mock$createUserError: function ( objRef, error ) {
      spyOn(objRef.fns, '$createUser' )
        .andCallFake( function( email, pass, cb ) {
          cb( error );
        }
      );
    }
  };

  return fn;
}