import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged , signInWithEmailAndPassword , sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getDatabase, ref,  child, get } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";

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


let form = document.getElementById('loginForm');
form.addEventListener("submit",(e)=>{
    e.preventDefault();
})
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    location.replace('../home.html')
  } else {
    // User is signed out
    // ...
  }
});
const user = auth.currentUser;

if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/firebase.User
  // ...
} else {
  console.log('not sign in')
}

form.onsubmit = ()=>{
    let email = document.querySelectorAll('input')[0].value;
    let password = document.querySelectorAll('input')[1].value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
        const user = userCredential.user;
      // ...
    })
    .catch((error) => {
            document.getElementById('error').innerHTML = "Your Password is wrong or Email is invalid";
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}
document.getElementById("for").onclick = () => {
    form.style.display = "none";
    document.querySelector("h2").style.display = "none";
    document.querySelector("span").style.display = "none";
    document.getElementById("for").style.display = "none";
    document.querySelector(".forgot").style.display = "flex";
}
document.getElementById("rest").onclick = () => {
    let restemail = document.querySelectorAll('input')[2].value;
    sendPasswordResetEmail(auth, restemail)
    .then(() => {
        document.querySelector(".forgot").children[0].innerHTML = "check Your Email for rest it password";
        document.querySelector(".forgot").children[0].style.color = "green";
        document.querySelector(".forgot").children[1].style.display = "none";
        document.querySelector(".forgot").children[2].style.display = "none";
    })
    .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    document.querySelector(".forgot").children[0].innerHTML = "Your Email is invalid!";
    document.querySelector(".forgot").children[0].style.color = "red";
    // ..
    });
}
let show =document.getElementById('show');
show.onclick = () => {
    if(show.classList.contains("fa-eye")){
        show.classList.replace("fa-eye" , "fa-eye-slash");
        document.querySelectorAll('input')[1].type = "text";
    }else{
        show.classList.replace("fa-eye-slash" ,"fa-eye" );
        document.querySelectorAll('input')[1].type = "password";
    }
}