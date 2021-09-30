import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";


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
const database = getDatabase();

function writeThemeColorData() {
    set(ref(database, 'ThemeColor/'), {
    primaryColor: "#9c27b0",
    buttonColor: "#9c27b0a8",
    borderColor : "#9c27b0e0"
    });
  }
writeThemeColorData();
let clrBtn = document.querySelector(".dots")
clrBtn.children[0].onclick =  function (){
    document.documentElement.style.setProperty('--prColor' , "#9c27b0");
    document.documentElement.style.setProperty('--btnBg', '#9c27b0a8');
    document.documentElement.style.setProperty('--brBtn', '#9c27b0e0');
    function writeNewThemeColorData(prClr, btnClr, brdClr){
        const newTheme ={
            primaryColor: prClr,
            buttonColor: btnClr,
            borderColor : brdClr
        }
        const updates = {};
        updates['ThemeColor/'] = newTheme; 
        return update(ref(database), updates);
    }
    writeNewThemeColorData('#9c27b0' , '#9c27b0a8' , '#9c27b0e0');
}
clrBtn.children[1].onclick = function (){
    document.documentElement.style.setProperty('--prColor' , "#1e2ba4");
    document.documentElement.style.setProperty('--btnBg', '#1e2ba4a8');
    document.documentElement.style.setProperty('--brBtn', '#1e2ba4e0');
    function writeNewThemeColorData(prClr, btnClr, brdClr){
        const newTheme ={
            primaryColor: prClr,
            buttonColor: btnClr,
            borderColor : brdClr
        }
        const updates = {};
        updates['ThemeColor/'] = newTheme; 
        return update(ref(database), updates);
    }
    writeNewThemeColorData("#1e2ba4" , '#1e2ba4a8' , '#1e2ba4e0');
}
clrBtn.children[2].onclick = function (){
    document.documentElement.style.setProperty('--prColor' , "#e91e63");
    document.documentElement.style.setProperty('--btnBg', '#e91e63a8');
    document.documentElement.style.setProperty('--brBtn', '#e91e63e0');
    function writeNewThemeColorData(prClr, btnClr, brdClr){
        const newTheme ={
            primaryColor: prClr,
            buttonColor: btnClr,
            borderColor : brdClr
        }
        const updates = {};
        updates['ThemeColor/'] = newTheme; 
        return update(ref(database), updates);
    }
    writeNewThemeColorData("#e91e63" , '#e91e63a8' , '#e91e63e0');
}
clrBtn.children[3].onclick = function (){
    document.documentElement.style.setProperty('--prColor' , "#ff5722");
    document.documentElement.style.setProperty('--btnBg', '#ff5722a8');
    document.documentElement.style.setProperty('--brBtn', '#ff5722e0');
    function writeNewThemeColorData(prClr, btnClr, brdClr){
        const newTheme ={
            primaryColor: prClr,
            buttonColor: btnClr,
            borderColor : brdClr
        }
        const updates = {};
        updates['ThemeColor/'] = newTheme; 
        return update(ref(database), updates);
    }
    writeNewThemeColorData("#ff5722" , '#ff5722a8' , '#ff5722e0');
}
let page1 = document.querySelector(".content");
let page2 = document.querySelector(".about");
let navbar = document.querySelectorAll("nav ul li a");
function pageAct(){
    page1.style.display = "none";
    page2.style.display = "none";
    for(let i = 0; i<navbar.length ; i++)
        navbar[i].classList.remove('active');
}
navbar[0].onclick = function (){
    pageAct();
    page1.style.display = "flex";
    navbar[0].classList.add('active');
}
navbar[1].onclick = function (){
    pageAct();
    page2.style.display = "flex";
    navbar[1].classList.add('active');
}
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    location.replace('pages/home.html')
  } else {
    // User is signed out
    // ...
  }
});