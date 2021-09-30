import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged , updateProfile , createUserWithEmailAndPassword , sendEmailVerification} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getDatabase, ref, child, get , set } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";


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
  location.reload();
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
    document.getElementById("error").style.display = "none"
    const emailVerified = user.emailVerified;
    if(emailVerified){
      location.replace('../home.html');
    }else {

    }
  }
});

let button = document.querySelector('button');
button.onclick = () => {
    let email = document.querySelectorAll('input')[3].value;
    let password = document.querySelectorAll('input')[4].value;
    let firstName = document.querySelectorAll('input')[0].value;
    let lastName = document.querySelectorAll('input')[1].value;
    let userName = document.querySelectorAll('input')[2].value;
    let validate = true;
    if(firstName === "" || firstName === null || firstName.startsWith(" ") || firstName.endsWith(" ") || firstName.trim("") == " "){
      validate = false;
    }
    if(lastName === "" || lastName === null || lastName.startsWith(" ") || lastName.endsWith(" ") || lastName.trim("") == " "){
      validate = false;
    }
    if(userName.includes(" ") || userName.trim("") == " " || userName == "" || userName == null){
      validate = false;
    }
    if(password.includes(" ")){
      validate = false;
    }
    if(!(email.includes("@") && (email.includes("gmail.com") || email.includes("yahoo.com") || email.includes("hotmail.com") || email.includes("outlook.com"))) || email.includes(' ')){
      validate = false;
    }
    if(validate == true){
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            sendEmailVerification(auth.currentUser)
            .then(() => {
            // Email verification sent!
            // ...
            });
            updateProfile(auth.currentUser, {
                displayName: `${firstName} ${lastName} ${userName}`, photoURL: "https://www.f-cdn.com/assets/main/en/assets/unknown.png"
              }).then(() => {
                let displayName = auth.currentUser.displayName;
                const email = auth.currentUser.email;
                const imageUrl = auth.currentUser.photoURL;
                const username = displayName.split(" ").pop();
                displayName = displayName.split(" ");
                displayName = displayName.slice(0 , displayName.length - 1).join(" ");
                // The user's ID, unique to the Firebase project. Do NOT use
                // this value to authenticate with your backend server, if
                // you have one. Use User.getToken() instead.
                const uid = auth.currentUser.uid;
                  set(ref(database, 'users/' + uid), {
                    fullName: displayName,
                    username: username,
                    email: email,
                    profile_picture : imageUrl,
                    themeColor: "#9c27b0",
                    facebookLink: "#",
                    instagramLink: "#",
                    githubLink: "#",
                    skills: "",
                    project: "",
                    bio: ""
                  });
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
    }else{
    }
}
let icon1 = document.getElementById("icon1");
document.querySelectorAll('input')[0].onkeyup = ()=>{
  icon1.style.display = "block";
  let firstName = document.querySelectorAll('input')[0].value;
  if(firstName === "" || firstName === null || firstName.startsWith(" ") || firstName.endsWith(" ") || firstName.trim("") == " "){
    icon1.classList.replace("fa-check","fa-times-circle");
    document.querySelectorAll('input')[0].style.outline = "auto"
    document.querySelectorAll('input')[0].style.outlineColor = "red";
    icon1.style.color = "red";
    icon1.title = "Invalid"
  }else{
    icon1.classList.replace("fa-times-circle","fa-check");
    document.querySelectorAll('input')[0].style.outline = "auto";
    document.querySelectorAll('input')[0].style.outlineColor = "green";
    icon1.style.color = "green";
    icon1.title = "Valid"
  }
}
let icon2 = document.getElementById("icon2");
document.querySelectorAll('input')[1].onkeyup = ()=>{
  icon2.style.display = "block";
  let lastName = document.querySelectorAll('input')[1].value;
  if(lastName === "" || lastName === null || lastName.startsWith(" ") || lastName.endsWith(" ") || lastName.trim("") == " "){
    icon2.classList.replace("fa-check","fa-times-circle");
    document.querySelectorAll('input')[1].style.outline = "auto"
    document.querySelectorAll('input')[1].style.outlineColor = "red";
    icon2.style.color = "red";
    icon2.title = "Invalid"
  }else{
    icon2.classList.replace("fa-times-circle","fa-check");
    document.querySelectorAll('input')[1].style.outline = "auto";
    document.querySelectorAll('input')[1].style.outlineColor = "green";
    icon2.style.color = "green";
    icon2.title = "Valid"
  }
}
let icon3 = document.getElementById("icon3");
document.querySelectorAll('input')[2].onkeyup = ()=>{
  icon3.style.display = "block";
  let userName = document.querySelectorAll('input')[2].value;
  if(userName.includes(" ") || userName.trim("") == " " || userName == "" || userName == null){
    icon3.classList.replace("fa-check","fa-times-circle");
    document.querySelectorAll('input')[2].style.outline = "auto"
    document.querySelectorAll('input')[2].style.outlineColor = "red";
    icon3.style.color = "red";
    icon3.title = "Invalid"
  }else{
    icon3.classList.replace("fa-times-circle","fa-check");
    document.querySelectorAll('input')[2].style.outline = "auto";
    document.querySelectorAll('input')[2].style.outlineColor = "green";
    icon3.style.color = "green";
    icon3.title = "Valid"
  }
}
document.querySelectorAll('input')[4].onkeyup = ()=>{
  let password = document.querySelectorAll('input')[4].value;
  if(password.includes(" ")){
    document.querySelectorAll('input')[4].style.outline = "auto"
    document.querySelectorAll('input')[4].style.outlineColor = "red";
  }else{
    document.querySelectorAll('input')[4].style.outline = "none";
    if(password.length >= 8){
      document.querySelectorAll('input')[4].style.outline = "auto"
      document.querySelectorAll('input')[4].style.outlineColor = "green";
    }
  }
}
let icon4 = document.getElementById("icon4");
document.querySelectorAll('input')[3].onkeyup = ()=>{
  icon4.style.display = "block";
  let email = document.querySelectorAll('input')[3].value;
  if(email.includes("@") && (email.includes("gmail.com") || email.includes("yahoo.com") || email.includes("hotmail.com") || email.includes("outlook.com"))){
    if(email.includes(" ")){
      document.querySelectorAll('input')[3].style.outline = "auto";
      document.querySelectorAll('input')[3].style.outlineColor = "red";
      icon4.classList.replace("fa-check","fa-times-circle");
      icon4.style.color = "red";
      icon4.title = "Invalid";
    }else{
      document.querySelectorAll('input')[3].style.outline = "auto";
      document.querySelectorAll('input')[3].style.outlineColor = "green";
      icon4.classList.replace("fa-times-circle","fa-check");
      icon4.style.color = "green";
      icon4.title = "Valid"
    }
  }else{
    document.querySelectorAll('input')[3].style.outline = "auto";
    document.querySelectorAll('input')[3].style.outlineColor = "red";
    icon4.classList.replace("fa-check","fa-times-circle");
    icon4.style.color = "red";
    icon4.title = "Invalid";
  }
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