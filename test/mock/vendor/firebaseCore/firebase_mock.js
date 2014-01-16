/*global SpecHelper */
/*exported FirebaseMock */
'use strict';

function FirebaseMock ( $timeout ) {

  function setOnceReturnValue ( objRef, returnValue ) {
    spyOn( objRef, 'once' ).andCallFake( function ( value, callback ) {
      var fn = function ( ) { return returnValue; };
      var response = { val: fn };
      $timeout( function ( ) {
        callback( response );
      }, 1000 );
    } );
  }

  function setSetReturnValue ( objRef, returnValue ) {
    spyOn( objRef, 'set' ).andCallFake( function ( value, callback ) {
      $timeout( function ( ) {
        callback( returnValue );
      }, 1000 );
    } );
  }

  var stub = SpecHelper.stub( 'set', 'once' );

  stub.mockHelper =  {

    mockSetError: function ( objRef, error ) {
      error = error || { msg: 'This is an error' };
      setSetReturnValue( objRef, error );
    },

    mockSetSuccess: function ( objRef ) {
      setSetReturnValue( objRef, undefined );
    },

    // Once returns an object with val() undefined on no record found
    mockOnceError: function ( objRef ) {
      setOnceReturnValue( objRef, undefined );
    },

    mockOnceSuccess: function ( objRef, returnValue ) {
      setOnceReturnValue( objRef, returnValue );
    }
  };

  return stub;
}