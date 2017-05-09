myApp.factory('Authentication',
['$rootScope', '$location','$firebaseObject', '$firebaseAuth',
function ($rootScope, $location, $firebaseObject, $firebaseAuth) {

  // reference to database
  var ref = firebase.database().ref();
  // reference authentication (gives access to different properties)
  var auth = $firebaseAuth();
  // set up object to have proper access to this
  var myObject;

  // handles when the state of authentication changes for a user
  auth.$onAuthStateChanged(function(authUser) {
    if(authUser) {
      var userRef = ref.child('users').child(authUser.uid);
      var userObj = $firebaseObject(userRef);

      $rootScope.currentUser = userObj;
    } else {
      $rootScope.currentUser = '';
    }
  });

  // methods stored in an object for handling authentication
  myObject = {
    login: function(user) {
      auth.$signInWithEmailAndPassword(
        user.email,
        user.password
      ).then(function(user) {
        $location.path('/success')
      }).catch(function(error) {
        $rootScope.message = error.message;
      }); // signinwithemailandpassword
    }, //login

    logout: function() {
      return auth.$signOut();
    }, //logout

    requireAuth: function() {
      return auth.$requireSignIn();
    }, // require Authentication

    register: function(user) {
      auth.$createUserWithEmailAndPassword(
        user.email,
        user.password
      ).then(function(regUser) {
        var regRef = ref.child('users')
          .child(regUser.uid).set({
            date: firebase.database.ServerValue.TIMESTAMP,
            regUser: regUser.uid,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
          }); //userinfo
        myObject.login(user);
      }).catch(function(error) {
        $rootScope.message = error.message;
      }); // createUserWithEmailAndPassword
    }// register
  }; // return

  return myObject;
}]); // factory
