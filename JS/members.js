import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged ,signOut , updateProfile} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getDatabase, ref, set , get , child , remove , update} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyB9SD076vOicz8-0T-PNgupqe73mXEt69U",
    authDomain: "projet-68bf1.firebaseapp.com",
    databaseURL: "https://projet-68bf1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "projet-68bf1",
    storageBucket: "projet-68bf1.appspot.com",
    messagingSenderId: "495300540543",
    appId: "1:495300540543:web:f3c751ff65bee615a0e74a"
};
var nb =[];
// Initialize Firebase
const app = initializeApp( firebaseConfig );
const auth = getAuth();
const database = getDatabase();
onAuthStateChanged(auth, (user) => {
    if (!user) {
      location.replace('login/login.html')
    } else {
      const uid = user.uid;
      const dbRef = ref(database);
      get(child(dbRef, `users/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            nb = snapshot.val();
            document.getElementById("userName").innerHTML = nb.fullName;
            document.getElementById("userPhoto").src = nb.profile_picture;
            document.documentElement.style.setProperty('--prColor' , nb.themeColor);
            document.documentElement.style.setProperty('--btnBg', `${nb.themeColor}a8`);
            document.documentElement.style.setProperty('--brBtn', `${nb.themeColor}e0`);
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
  
        });

    }
});

let list = [];
let uids;
await get(child(ref(database), `users/`)).then((snapshot) => {
    if (snapshot.exists()) {
        list = Object.values(snapshot.val());
        uids = snapshot.val();
        uids = Object.keys(uids);
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    location.reload()
});
console.log(list);
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let body = document.querySelector(".body");
let m = [];
function add(){
    for(var i = 0 ; i < list.length ; i++){
        if(uids[i] != auth.currentUser.uid){
            let card = document.createElement("div");
        card.classList.add("card");
        card.id = i;
        let content = document.createElement("div");
        content.classList.add("content");
        let imgBx = document.createElement("div");
        imgBx.classList.add("imgBx");
        let img = document.createElement("img");
        img.src = list[i].profile_picture;
        imgBx.appendChild(img);
        let contentBx = document.createElement("div");
        contentBx.classList.add("contentBx");
        let p = document.createElement("h3");
        p.innerHTML = list[i].fullName;
        p.id = uids[i];
        let span = document.createElement("span");
        span.innerHTML = list[i].username;
        p.appendChild(span);
        contentBx.appendChild(p);
        content.appendChild(imgBx);
        content.appendChild(contentBx);
        let ul = document.createElement("ul");
        ul.classList.add("sci");
        let li1 = document.createElement("li");
        li1.setAttribute("style" , "--i:1;");
        let a1 = document.createElement("a");
        a1.href = list[i].facebookLink;
        let i1 = document.createElement("i");
        i1.classList.add("fa", "fa-facebook")
        a1.appendChild(i1)
        li1.appendChild(a1);
        let li2 = document.createElement("li");
        li2.setAttribute("style" , "--i:2;");
        let a2 = document.createElement("a");
        let i2 = document.createElement("i");
        i2.classList.add("fa", "fa-instagram")
        a2.appendChild(i2)
        a2.href = list[i].instagramLink;
        li2.appendChild(a2);
        let li3 = document.createElement("li");
        li3.setAttribute("style" , "--i:3;");
        let a3 = document.createElement("a");
        let i3 = document.createElement("i");
        i3.classList.add("fa", "fa-github")
        a3.appendChild(i3)
        a3.href = list[i].githubLink;
        li3.appendChild(a3);
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        card.appendChild(content);
        card.appendChild(ul);
        p.onclick = ()=>{
            localStorage.setItem('uid', p.id);
            set(ref(getDatabase(), 'users/' + auth.currentUser.uid + "/history/" + p.id), {
                1 : "",
            });
            location.replace("memberProfile.html");
        };
        m.push(card);
        }
    }
}
add();
let num = Math.ceil(m.length/8);
nu();
function nu(){
    if(m.length <= 8){
        display(0 , m.length , 1);
    }else{
        display(0 , 8 , 1);
    }
}
function display(f,l,id){
    body.id = `i${id}`
    body.innerHTML = "";
    for(var j = f;j < l; j++){
        body.appendChild(m[j])
    }
    disabled();
    document.getElementById("numb").innerHTML = `${id} / ${num}`;
}
function disabled(){
    let id = body.id;
    id = id.slice(1 , id.length);
    let t = body.id.slice(0 , 1);
    console.log(id)
    if(t == 'i'){
        if(id == 1 || id == 0){
            prev.setAttribute("disabled" , "");
        }
        console.log(num)
        if(id == num || id == 0){
            next.setAttribute("disabled" , "");
        }
    }else{
        let num1 = Math.ceil(nb.length/8);
        if(id == 1 || id == 0){
            prev.setAttribute("disabled" , "");
        }
        console.log(num1)
        if(id == num1 || id == 0){
            next.setAttribute("disabled" , "");
        }
    }
}
var nb = [];
function unable (){
    let id = body.id;
    id = id.slice(1 , id.length);
    let t = body.id.slice(0 , 1);
    console.log(id)
    if(t == 'i'){
        if(id > 1){
            prev.removeAttribute("disabled");
        }
        console.log(num)
        if(id < num){
            next.removeAttribute("disabled");
        }
    }else{
        let num1 = Math.ceil(nb.length/8);
        if(id > 1){
            prev.removeAttribute("disabled");
        }
        console.log(num1)
        if(id < num1){
            next.removeAttribute("disabled");
        }
    }
}
next.onclick = ()=>{
    let id = body.id;
    id = id.slice(1 , id.length);
    id = parseInt(id) + 1;
    let t = body.id.slice(0 , 1);
    let d = body.lastElementChild.id;
    d = parseInt(d);
    if(t == 'i'){
        if(m.length >= d+9){
            display(d+1 , d+9 , id)
        }else{
            display(d+1 , m.length , id)
        }
    }else{
        let num1 = Math.ceil(nb.length/8);
        if(nb.length >= d+9){
            display1(d+1 , d+9 , id , num1)
        }else{
            display1(d+1 , nb.length , id , num1)
        }
    }
    disabled();
    unable();
}
prev.onclick = ()=>{
    let id = body.id;
    id = id.slice(1 , id.length);
    let t = body.id.slice(0 , 1);
    id = parseInt(id) - 1;
    let d = body.firstElementChild.id;
    d = parseInt(d);
    if(t == 'i'){
        display(d-8 , d , id)
    }else{
        let num1 = Math.ceil(nb.length/8);
        display1(d-8 , d , id , num1)
    }
    disabled();
    unable();
}
let search = document.getElementById('search');
search.onkeyup = ()=>{
    let value = search.value;
    console.log(value);
    srch(value);
}

function srch(value){
    body.innerHTML = "";
    nb = [];
    for(var k = 0 ; k < m.length ; k++){
    let text = m[k].firstElementChild.lastElementChild.firstElementChild.firstChild.textContent;
    text = text.toLowerCase();
    if(text.includes(value.toLowerCase())){
        m[k].id = `${nb.length}`;
        nb.push(m[k])
    }
    }
    console.log(nb.length)
    let num1 = Math.ceil(nb.length/8);
    console.log(num1)
    nu1(num1);
    bodyVide()
}
function nu1(num1){
    if(nb.length <= 8){
        display1(0 , nb.length , 1 ,num1);
    }else{
        display1(0 , 8 , 1 , num1);
    }
}
function display1(f,l,id ,num1){
    body.id = `l${id}`
    body.innerHTML = "";
    for(var j = f;j < l; j++){
        body.appendChild(nb[j])
    }
    disabled();
    document.getElementById("numb").innerHTML = `${id} / ${num1}`;
}
bodyVide();
function bodyVide(){
    if(body.children.length == 0){
        let id =body.id.slice(0,1);
        body.id = `${id}0`;
        document.getElementById("numb").innerHTML = `${0} / ${0}`;
        disabled();
    }else{
        unable()
    }
}
document.getElementById("signOut").onclick = ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}
let history = document.getElementById("history");
let all = document.getElementById("all");
let clear = document.getElementById("clear");
history.onclick = async()=>{
    document.getElementById("history1").style.display = "flex";
    body.style.display = "none";
    clear.style.display = "block";
    search.style.display = "none";
    search.previousElementSibling.style.display = "none";
    history.classList.add("act");
    all.classList.remove("act");
    document.querySelector(".footer").style.display = "none";
    let his;
    await get(child(ref(database), `users/${auth.currentUser.uid}/history`)).then((snapshot) => {
        if (snapshot.exists()) {
            his = Object.keys(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {});
    if(his){
        for(var i = 0 ; i < m.length ; i++){
            for(var j = 0 ; j < his.length ; j++){
                if(m[i].firstElementChild.lastElementChild.firstElementChild.id == his[j]){
                    document.getElementById("history1").appendChild(m[i]);
                }
            }
        }
    }else{
        document.getElementById("history1").innerHTML = "Your history is empty"
    }
}
all.onclick = ()=>{
    clear.style.display = "none";
    document.getElementById("history1").style.display = "none";
    body.style.display = "flex";
    search.style.display = "block";
    search.previousElementSibling.style.display = "block";
    all.classList.add("act");
    history.classList.remove("act");
    document.querySelector(".footer").style.display = "flex";
    search.value = "";
    nu();
}
clear.onclick = ()=>{
    var myPath = ref(getDatabase(), 'users/' + auth.currentUser.uid + "/history");
    remove(myPath).then(function() {
            console.log("Remove succeeded.")
    })
    .catch(function(error) {
            console.log("Remove failed: " + error.message)
    });
    all.click();
    history.click();
}