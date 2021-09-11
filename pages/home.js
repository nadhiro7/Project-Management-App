import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged ,signOut} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyB9SD076vOicz8-0T-PNgupqe73mXEt69U",
    authDomain: "projet-68bf1.firebaseapp.com",
    databaseURL: "https://projet-68bf1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "projet-68bf1",
    storageBucket: "projet-68bf1.appspot.com",
    messagingSenderId: "495300540543",
    appId: "1:495300540543:web:f3c751ff65bee615a0e74a"
};
let nb =[];
// Initialize Firebase
const app = initializeApp( firebaseConfig );
const auth = getAuth();
const database = getDatabase();
onAuthStateChanged(auth, (user) => {
    if (!user) {
      location.replace('login/login.html')
    } else {
      // The user object has basic properties such as display name, email, etc.
      let displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const username = displayName.split(" ").pop();
      displayName = displayName.split(" ");
      displayName = displayName.slice(0 , displayName.length - 1).join(" ");
      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
      writeUserData(uid , displayName ,username , email , photoURL);
      
    }
});
function writeUserData(userId, theName, name, email, imageUrl) {
  set(ref(database, 'users/' + userId), {
    fullName: theName,
    username: name,
    email: email,
    profile_picture : imageUrl,
  });
}
document.querySelector('button').onclick = ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}