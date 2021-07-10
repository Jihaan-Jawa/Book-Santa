import  firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyC8J2RIp-dY_3ugN_vh3yqj_XWvMJQibkU",
    authDomain: "booksanta-260f2.firebaseapp.com",
    projectId: "booksanta-260f2",
    storageBucket: "booksanta-260f2.appspot.com",
    messagingSenderId: "343169285501",
    appId: "1:343169285501:web:aae68581c95b126f38e014"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();