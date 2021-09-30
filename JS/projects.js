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
const dbRef = ref(database);
onAuthStateChanged(auth, (user) => {
    if (!user) {
      location.replace('login/login.html')
    } else {
      const uid = user.uid;
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

let pr = [];
let id;
await get(child(ref(database), `projects/`)).then((snapshot) => {
    if (snapshot.exists()) {
        pr = Object.values(snapshot.val());
        id = snapshot.val();
        id = Object.keys(id);
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    location.reload()
});
console.log(pr);
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let body = document.querySelector(".body");
let m = [];
function add(){
    for(var i = 0 ; i < pr.length ; i++){
        let parent = document.createElement('div');
        parent.setAttribute("class" , "project");
        let firstImg = document.createElement('img');
        firstImg.setAttribute("src" , pr[i].authorPic);
        let div = document.createElement('div');
        let firstDiv = document.createElement('div');
        let secondImg = document.createElement('img');
        let unp = document.createElement('p');
        get(child(dbRef, `users/${pr[i].uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                secondImg.setAttribute("src" , snapshot.val().profile_picture);
                unp.innerHTML = snapshot.val().fullName;
            }
        });
        let childDiv = document.createElement('div');
        let anchor = document.createElement('a');
        let icon = document.createElement("i");
        let p = document.createElement("p");
        p.textContent = pr[i].uid;
        p.style.display = "none";
        get(child(ref(getDatabase()), 'projects/' + id[i] + "/likesUid")).then((snapshot) => {
            if (snapshot.exists()) {
                let l = Object.keys(snapshot.val())
                let n;
                for(var i = 0 ; i < l.length ; i++){
                    if(l[i] === auth.currentUser.uid ){
                        n = true;
                        break;
                    }
                    else{
                        n = false;
                    }
                }
                if(n === true){
                    icon.setAttribute("class" , "fa fa-heart");
                }else{
                    icon.setAttribute("class" , "fa fa-heart-o");
                }
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
        icon.classList.add("like")
        icon.innerHTML = pr[i].likeCount;
        anchor.setAttribute("href" , pr[i].proGithub);
        anchor.innerHTML = pr[i].title;
        childDiv.appendChild(anchor);
        childDiv.appendChild(unp);
        firstDiv.appendChild(secondImg);
        firstDiv.appendChild(childDiv);
        div.appendChild(firstDiv);
        div.appendChild(icon);
        div.appendChild(p);
        icon.setAttribute("id" , id[i]);
        parent.appendChild(firstImg);
        parent.appendChild(div);
        firstImg.addEventListener("click",()=>{
            localStorage.setItem('projectId', icon.id);
            location.replace("showProject.html");
        })
        m.push(parent);
        icon.addEventListener("click", function()
            {
                let clicked_id = icon.id;
                const dbRef = ref(getDatabase());
                get(child(dbRef, 'projects/' + clicked_id + "/likesUid")).then((snapshot) => {
                    if (snapshot.exists()) {
                    let likes = Object.keys(snapshot.val())
                    let ln;
                    for(var i = 0 ; i < likes.length ; i++){
                        if(likes[i] === auth.currentUser.uid ){
                            ln = true;
                            break;
                        }
                        else{
                            ln = false;
                        }
                    }
                    console.log(likes);
                    console.log(ln);
                    if(ln === true){
                        var myPath = ref(getDatabase(), 'projects/' + clicked_id + "/likesUid/" + auth.currentUser.uid);
                        remove(myPath).then(function() {
                                console.log("Remove succeeded.")
                        })
                        .catch(function(error) {
                                console.log("Remove failed: " + error.message)
                        });
                        var myPath1 = ref(getDatabase(), 'users/' + auth.currentUser.uid + "/projectsLiked/" + clicked_id);
                        remove(myPath1).then(function() {
                                console.log("Remove succeeded.")
                        })
                        .catch(function(error) {
                                console.log("Remove failed: " + error.message)
                        });
                        let c= likes.length;
                        c -= 2;
                        change(c);
                        function change (c){
                            const updates = {};
                            updates['projects/' + clicked_id + '/likeCount'] = c;
                            return update(ref(getDatabase()), updates);
                        }
                    }else{
                        let a = likes.length;
                        set(ref(getDatabase(), 'projects/' + clicked_id + "/likesUid/" + auth.currentUser.uid), {
                            [a] : "",
                        });
                        change(a);
                        function change (){
                            const updates = {};
                            updates['projects/' + clicked_id + '/likeCount'] = a;
                            return update(ref(getDatabase()), updates);
                        }
                        set(ref(getDatabase(), 'users/' + auth.currentUser.uid + "/projectsLiked/" + clicked_id), {
                            1 : "",
                        });
                    }
                    } else {
                    console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
                let uid = document.getElementById(clicked_id).nextElementSibling.textContent;
                get(child(dbRef, 'users/' + uid + '/' + 'project/' + clicked_id + "/likesUid")).then((snapshot) => {
                    if (snapshot.exists()) {
                    let likes = Object.keys(snapshot.val())
                    let ln;
                    for(var i = 0 ; i < likes.length ; i++){
                        if(likes[i] === auth.currentUser.uid ){
                            ln = true;
                            break;
                        }
                        else{
                            ln = false;
                        }
                    }
                    console.log(likes);
                    console.log(ln);
                    if(ln === true){
                        var myPath = ref(getDatabase(), 'users/' + uid + '/' + 'project/' + clicked_id + "/likesUid/" + auth.currentUser.uid);
                        remove(myPath).then(function() {
                                console.log("Remove succeeded.")
                        })
                        .catch(function(error) {
                                console.log("Remove failed: " + error.message)
                        });
                        let c= likes.length;
                        c -= 2;
                        change(c);
                        function change (c){
                            const updates = {};
                            updates['users/' + uid + '/' + 'project/' + clicked_id+ '/likeCount'] = c;
                            return update(ref(getDatabase()), updates);
                        }
                        console.log(document.getElementById(this.id));
                        if(document.getElementById(this.id).classList.contains("fa-heart"))
                        {
                            document.getElementById(this.id).classList.replace("fa-heart","fa-heart-o");
                        }
                        document.getElementById(this.id).innerHTML = c;
                    }else{
                        let a = likes.length;
                        set(ref(getDatabase(), 'users/' + uid + '/' + 'project/' + clicked_id + "/likesUid/" + auth.currentUser.uid), {
                            [a] : "",
                        });
                        change(a);
                        function change (){
                            const updates = {};
                            updates[getDatabase(), 'users/' + uid + '/' + 'project/' + clicked_id+ '/likeCount'] = a;
                            return update(ref(getDatabase()), updates);
                        }
                        document.getElementById(this.id).classList.replace("fa-heart-o","fa-heart");
                        document.getElementById(this.id).innerHTML = a;
                    }
                    } else {
                    console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            })
    }
}
add();
let num = Math.ceil(m.length/6);
nu();
function nu(){
    if(m.length <= 6){
        display(0 , m.length , 1);
    }else{
        display(0 , 6 , 1);
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
        if(m.length >= d+7){
            display(d+1 , d+7 , id)
        }else{
            display(d+1 , m.length , id)
        }
    }else{
        let num1 = Math.ceil(nb.length/8);
        if(nb.length >= d+7){
            display1(d+1 , d+7 , id , num1)
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
        display(d-6 , d , id)
    }else{
        let num1 = Math.ceil(nb.length/8);
        display1(d-6 , d , id , num1)
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
    let text = m[k].lastElementChild.firstElementChild.lastElementChild.firstElementChild.firstChild.textContent;
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
    if(nb.length <= 6){
        display1(0 , nb.length , 1 ,num1);
    }else{
        display1(0 , 6 , 1 , num1);
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
let liked = document.getElementById("liked");
let all = document.getElementById("all");
let clear = document.getElementById("clear");
liked.onclick = async()=>{
    document.getElementById("liked1").style.display = "flex";
    body.style.display = "none";
    search.style.display = "none";
    search.previousElementSibling.style.display = "none";
    liked.classList.add("act");
    all.classList.remove("act");
    document.querySelector(".footer").style.display = "none";
    let his;
    await get(child(ref(database), `users/${auth.currentUser.uid}/projectsLiked`)).then((snapshot) => {
        if (snapshot.exists()) {
            his = Object.keys(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {});
    console.log(m[0].lastElementChild.lastElementChild.previousElementSibling.id)
    if(his){
        for(var i = 0 ; i < m.length ; i++){
            for(var j = 0 ; j < his.length ; j++){
                if(m[i].lastElementChild.lastElementChild.previousElementSibling.id == his[j]){
                    document.getElementById("liked1").appendChild(m[i]);
                }
            }
        }
    }else{
        document.getElementById("liked1").innerHTML = "Your liked is empty"
    }
}
all.onclick = ()=>{
    document.getElementById("liked1").style.display = "none";
    body.style.display = "flex";
    search.style.display = "block";
    search.previousElementSibling.style.display = "block";
    all.classList.add("act");
    liked.classList.remove("act");
    document.querySelector(".footer").style.display = "flex";
    search.value = "";
    nu();
}