import * as firebase from "firebase";
require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyBhDg7qd5dLNRpzWVp4jIBEMdpPbuxYFQQ",
    authDomain: "wily-c58e3.firebaseapp.com",
    databaseURL: "https://wily-c58e3.firebaseio.com",
    projectId: "wily-c58e3",
    storageBucket: "wily-c58e3.appspot.com",
    messagingSenderId: "500812973895",
    appId: "1:500812973895:web:db083206dbb04958f1ee62"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();