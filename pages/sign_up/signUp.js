import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged , updateProfile , createUserWithEmailAndPassword , sendEmailVerification} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyB9SD076vOicz8-0T-PNgupqe73mXEt69U",
    authDomain: "projet-68bf1.firebaseapp.com",
    databaseURL: "https://projet-68bf1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "projet-68bf1",
    storageBucket: "projet-68bf1.appspot.com",
    messagingSenderId: "495300540543",
    appId: "1:495300540543:web:f3c751ff65bee615a0e74a"
};

// Initialize Firebase
const app = initializeApp( firebaseConfig );
const auth = getAuth();
const database = getDatabase();
let themeColor = {};
const dbRef = ref(getDatabase());
get(child(dbRef, `ThemeColor/`)).then((snapshot) => {
  if (snapshot.exists()) {
    themeColor = snapshot.val();
    document.documentElement.style.setProperty('--prColor' ,themeColor.primaryColor);
    document.documentElement.style.setProperty('--btnBg', themeColor.buttonColor);
    document.documentElement.style.setProperty('--brBtn', themeColor.borderColor);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

let form = document.getElementById("signUpForm");
form.addEventListener("submit" , (e) => {
    e.preventDefault();
})
onAuthStateChanged(auth, (user) => {
    if (user) {
    form.style.display = "none";
    document.querySelector('h2').style.display = "none";
    document.querySelector(".check").style.display = "flex";
    document.querySelector("span").style.display = "none";
    const emailVerified = user.emailVerified;
        if(emailVerified){
            location.replace('../home.html')
        }
    } else {

    }
});

let button = document.querySelector('button');
button.onclick = () => {
    let email = document.querySelectorAll('input')[3].value;
    let password = document.querySelectorAll('input')[4].value;
    let firstName = document.querySelectorAll('input')[0].value;
    let lastName = document.querySelectorAll('input')[1].value;
    let userName = document.querySelectorAll('input')[2].value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            sendEmailVerification(auth.currentUser)
            .then(() => {
            // Email verification sent!
            // ...
            });
            updateProfile(auth.currentUser, {
                displayName: `${firstName} ${lastName} ${userName}`, photoURL: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }).then(() => {
                // Profile updated!
                // ...
              }).catch((error) => {
                // An error occurred
                // ...
              });
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    document.getElementById('error').innerHTML = errorMessage;
    });
}



let show =document.getElementById('show');
show.onclick = () => {
    if(show.classList.contains("fa-eye")){
        show.classList.replace("fa-eye" , "fa-eye-slash");
        document.querySelectorAll('input')[4].type = "text";
    }else{
        show.classList.replace("fa-eye-slash" ,"fa-eye" );
        document.querySelectorAll('input')[4].type = "password";
    }
}