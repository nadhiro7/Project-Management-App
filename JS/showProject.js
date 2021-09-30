import { initializeApp} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged ,signOut , updateProfile} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getDatabase, ref, set , get , update, child , push, remove , onValue} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";



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
let com = document.querySelector(".com")
onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.replace('login/login.html')
    } else {
        get(child(ref(database), `users/${auth.currentUser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                document.documentElement.style.setProperty('--prColor' , snapshot.val().themeColor);
                document.documentElement.style.setProperty('--btnBg', `${snapshot.val().themeColor}a8`);
                document.documentElement.style.setProperty('--brBtn', `${snapshot.val().themeColor}e0`);
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
                console.error(error);
        });
    }
});
let add = document.getElementById("send");
let projectId =  localStorage.getItem("projectId");
if(projectId == null || typeof projectId == "undefined"){
    location.replace("projects.html");
}
let currentUser;
const dbRef = ref(getDatabase());
await get(child(dbRef, `projects/${projectId}`)).then((snapshot) => {
  if (snapshot.exists()) {
      let name = document.getElementById('name');
    name.id = snapshot.val().uid;
    get(child(dbRef, `users/${snapshot.val().uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById('photoProfile').setAttribute("src" , snapshot.val().profile_picture);
            name.innerHTML = snapshot.val().fullName;
        }
    });
    name.addEventListener("click",()=>{
        localStorage.setItem('uid', name.id);
        location.replace("memberProfile.html");
    });
    currentUser = auth.currentUser.uid;
    document.title = `SCC | ${snapshot.val().title}`
    document.getElementById('projectName').innerHTML = snapshot.val().title;
    document.getElementById('projectPhoto').src = snapshot.val().authorPic;
    document.getElementById('src').href = snapshot.val().proGithub;
    document.getElementById('src').innerHTML = snapshot.val().proGithub;
    document.getElementById("likeCount").innerHTML = `${snapshot.val().likeCount} Likes`;
    document.getElementById("commentCount").innerHTML = `${snapshot.val().commentCount} Comments`;
    document.getElementById("iconComment").addEventListener("click",()=>{
        document.getElementById("add").focus();
    })
    let l = Object.keys(snapshot.val().likesUid)
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
        document.getElementById("iconLike").setAttribute("class" , "fa fa-heart");
    }else{
        document.getElementById("iconLike").setAttribute("class" , "fa fa-heart-o");
    }
    document.getElementById("iconLike").addEventListener("click", function()
    {
        let clicked_id = projectId;
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
            }
            } else {
            console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        let uid1 = name.id;
        get(child(dbRef, 'users/' + uid1 + '/' + 'project/' + clicked_id + "/likesUid")).then((snapshot) => {
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
                var myPath = ref(getDatabase(), 'users/' + uid1 + '/' + 'project/' + clicked_id + "/likesUid/" + auth.currentUser.uid);
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
                    updates['users/' + uid1 + '/' + 'project/' + clicked_id+ '/likeCount'] = c;
                    return update(ref(getDatabase()), updates);
                }
                console.log(document.getElementById(this.id));
                if(document.getElementById(this.id).classList.contains("fa-heart"))
                {
                    document.getElementById(this.id).classList.replace("fa-heart","fa-heart-o");
                }
                document.getElementById("likeCount").innerHTML = `${c} Likes`;
            }else{
                let a = likes.length;
                set(ref(getDatabase(), 'users/' + uid1 + '/' + 'project/' + clicked_id + "/likesUid/" + auth.currentUser.uid), {
                    [a] : "",
                });
                change(a);
                function change (){
                    const updates = {};
                    updates[getDatabase(), 'users/' + uid1 + '/' + 'project/' + clicked_id+ '/likeCount'] = a;
                    return update(ref(getDatabase()), updates);
                }
                document.getElementById(this.id).classList.replace("fa-heart-o","fa-heart");
                document.getElementById("likeCount").innerHTML = `${a} Likes`;
            }
            } else {
            console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    })
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
  location.reload();
});
let coms = [];
await get(child(ref(getDatabase()), `projects/${projectId}/comments`)).then((snapshot) => {
    if (snapshot.exists()) {
        coms = Object.values(snapshot.val());
    } else {
        console.log("No data available");
    }
}).catch((error) => {});

if(coms){
    for(var i = 0 ; i < coms.length - 1 ; i++){
        createComment(coms[i]);
    }
}
let input = document.getElementById('add');
add.onclick = async ()=>{
    let comment = input.value;
    if(comment === "" || comment.trim(" ") === "")
      console.log("error");
    else{
        let userInfo;
        await get(child(ref(getDatabase()), `users/${auth.currentUser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                userInfo = snapshot.val();
            } else {
                console.log("No data available");
            }
        }).catch((error) => {});
        let comId;
        let num;
        await get(child(ref(getDatabase()), `projects/${projectId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                comId = `comment${snapshot.val().commentCount}`;
                num = snapshot.val().commentCount;
            } else {
                console.log("No data available");
            }
        }).catch((error) => {});
        AddComment(auth.currentUser.uid , userInfo.fullName , userInfo.profile_picture , comment , Date().slice(0, 21) , comId , num);
        input.value = "";
    }
}
function AddComment(userId, name, imageUrl , comment ,date ,comId ,num) {
    set(ref(getDatabase(), 'projects/'+ projectId + "/comments/" + comId), {
      name: name,
      userId: userId,
      profile_picture : imageUrl,
      date: date,
      comment: comment
    });
    AddC(num+1)
    function AddC(num) {
        const updates = {};
        updates[getDatabase(),`projects/${projectId}/commentCount`] = num;
        return update(ref(getDatabase()), updates);
    }
    document.getElementById("commentCount").innerHTML = `${num + 1} Comments`;
}
function createComment(comment){
    if(comment){
        let div = document.createElement("div");
        div.classList.add("row");
        let img = document.createElement("img");
        img.src = comment.profile_picture;
        div.appendChild(img);
        let col = document.createElement("div");
        col.classList.add("col");
        let child = document.createElement("div");
        let h3 = document.createElement("h3");
        h3.innerHTML = comment.name;
        h3.id = comment.userId;
        let p = document.createElement("p");
        p.innerHTML = comment.comment;
        child.appendChild(h3);
        child.appendChild(p);
        let span = document.createElement("span");
        span.innerHTML = comment.date;
        col.appendChild(child);
        col.appendChild(span);
        div.appendChild(col);
        h3.addEventListener("click",()=>{
            localStorage.setItem('uid', h3.id);
            location.replace("memberProfile.html");
        })
        com.appendChild(div);
    }
}
let nw;
const starCountRef = ref(getDatabase(),`projects/${projectId}/comments`);
await onValue(starCountRef, (snapshot) => {
    nw = Object.values(snapshot.val());
    newCom();
});
function newCom(){
    createComment(nw[nw.length - 1])
}
console.log(child(ref(getDatabase()), `projects/${projectId}/comments`))