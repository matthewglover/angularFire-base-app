'use strict';

/**
 * This module monitors angularFire's authentication and performs actions based on authentication state.
 *
 * See usage examples here: https://gist.github.com/katowulf/7328023
 */
angular.module( 'waitForAuth', [ ] )

/**
 * A service that returns a promise object, which is resolved once $firebaseAuth
 * is initialized (i.e. it returns login, logout, or error)
 */
   .service( 'waitForAuth', function( $rootScope, $q, $timeout ) {
    // Callback function for firebaseAuth event
    function fn() {
      for(var i = 0, n = subs.length; i < n; i++) { subs[i](); }
      $timeout(function() { def.resolve(); });
    }

    var def, subs;
    def = $q.defer();
    subs = [];
    subs.push($rootScope.$on('$firebaseAuth:login', fn));
    subs.push($rootScope.$on('$firebaseAuth:logout', fn));
    subs.push($rootScope.$on('$firebaseAuth:error', fn));

    return def.promise;
  })

/**
 * A directive that hides the element from view until waitForAuth resolves
 */
  .directive( 'ngCloakAuth', function( waitForAuth ) {
    return {
      restrict: 'A',
      compile: function( el ) {
        el.addClass( 'hide' );
        waitForAuth.then( function( ) {
          el.removeClass('hide');
        });
      }
    };
  })

/**
 * A directive that shows the elemen until waitForAuth resolves
 */
  .directive( 'ngCloakOnAuth', function( waitForAuth ) {
    return {
      restrict: 'A',
      compile: function( el ) {
        waitForAuth.then( function( ) {
          el.addClass('hide');
        });
      }
    };
  })

/**
 * A directive that shows elements only when the given authentication state is in effect
 */
  .directive('ngShowAuth', function($rootScope) {
    var loginState;
    return {
      restrict: 'A',
      compile: function ( el, attr ) {
        var expState = attr.ngShowAuth;
        function fn ( newState ) {
          loginState = newState;
          el.toggleClass('hide', loginState !== expState );
        }
        fn(null);
        $rootScope.$on('$firebaseAuth:login',  function() { fn('login'); });
        $rootScope.$on('$firebaseAuth:logout', function() { fn('logout'); });
        $rootScope.$on('$firebaseAuth:error',  function() { fn('error'); });
      }
    };
  });
