import { initializeApp} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged ,signOut , updateProfile} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
import { getDatabase, ref, set , get , update, child , push, remove , runTransaction , onChildAdded} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-database.js";



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



let social = document.querySelectorAll(".social a");
let Skills = document.querySelector(".skills ul");
let projects = document.querySelector('.pro');
onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.replace('login/login.html')
    } else {
        let userInfo;
        const uid = user.uid;
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                userInfo = snapshot.val()
                console.log(userInfo);
                document.getElementById("userName").innerHTML = userInfo.fullName;
                document.getElementById("userPhoto").src = userInfo.profile_picture;
                document.getElementById("name").innerHTML = userInfo.fullName;
                document.getElementById("usn").innerHTML = userInfo.username;
                document.documentElement.style.setProperty('--prColor' , userInfo.themeColor);
                document.documentElement.style.setProperty('--btnBg', `${userInfo.themeColor}a8`);
                document.documentElement.style.setProperty('--brBtn', `${userInfo.themeColor}e0`);
                if(userInfo.bio === ""){
                    document.getElementById("bio").innerHTML = "Your Bio";
                }else{
                    document.getElementById("bio").innerHTML = userInfo.bio;
                }
                let email = document.createTextNode(userInfo.email)
                document.getElementById("email").appendChild(email);
                document.getElementById("email").href = `mailto:${userInfo.email}`;
                document.getElementById("proImg").src = userInfo.profile_picture;
                social[0].href = userInfo.facebookLink;
                social[1].href = userInfo.githubLink;
                social[2].href = userInfo.instagramLink;
                if(userInfo.skills === ""){
                    Skills.innerHTML = "No skills to show";
                }else{
                    let sk = Object.values(userInfo.skills);
                    for(var i = 0 ; i < sk.length ; i++){
                        let li = document.createElement('li');
                        li.textContent = sk[i];
                        Skills.appendChild(li);
                    }
                }
                if(userInfo.project === "" || userInfo.project === null || typeof userInfo.project === "undefined" ){
                    document.querySelector('.pro').innerHTML = "No projects to show";
                }else{
                    let pr = Object.values(userInfo.project);
                    for(var i = 0 ;i < pr.length ; i++){
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
                    let remove = document.createElement("i");
                    get(child(ref(getDatabase()), 'projects/' + Object.keys(userInfo.project)[i] + "/likesUid")).then((snapshot) => {
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
                    remove.setAttribute("class" , "fa fa-remove remove");
                    remove.setAttribute("title" , "Remove project");
                    remove.setAttribute("id" , Object.keys(userInfo.project)[i]);
                    remove.setAttribute("style" , "position: absolute; cursor: pointer; right: 15px; top: 10px; font-size: 20px; color: #fff;");
                    icon.innerHTML = pr[i].likeCount;
                    anchor.setAttribute("href" , pr[i].proGithub);
                    anchor.innerHTML = pr[i].title;
                    childDiv.appendChild(anchor);
                    childDiv.appendChild(unp);
                    firstDiv.appendChild(secondImg);
                    firstDiv.appendChild(childDiv);
                    div.appendChild(firstDiv);
                    div.appendChild(icon);
                    firstImg.addEventListener("click",()=>{
                        localStorage.setItem('projectId', remove.id);
                        location.replace("showProject.html");
                    })
                    icon.setAttribute("id" , Object.keys(userInfo.project)[i] + i);
                    parent.appendChild(firstImg);
                    parent.appendChild(div);
                    parent.appendChild(remove);
                    projects.appendChild(parent)
                    }
                    let rm = document.querySelectorAll(".remove").forEach((ele, index)=>{
                        ele.addEventListener("click", function()
                        {
                            let clicked_id = ele.id;
                            var MyPath = ref(getDatabase() , 'users/'+ auth.currentUser.uid + '/project/' + clicked_id);
                            remove(MyPath).then(function() {
                                console.log("Remove succeeded.")
                            })
                            .catch(function(error) {
                                console.log("Remove failed: " + error.message)
                            });
                            var myPath = ref(getDatabase() , 'projects/'+ clicked_id);
                            remove(myPath).then(function() {
                                console.log("Remove succeeded.")
                            })
                            .catch(function(error) {
                                console.log("Remove failed: " + error.message)
                            });
                            projects.removeChild( document.getElementById( clicked_id ).parentElement );
                        })
                    })
                    let likes = document.querySelectorAll(".like").forEach((ele, index)=>{
                        ele.addEventListener("click", function()
                        {
                            let clicked_id = ele.id;
                            clicked_id = clicked_id.slice(0 , clicked_id.length-1);
                            let b = clicked_id;
                            const projectRef = ref(getDatabase(), 'projects/' + clicked_id);
                            const proRef = ref(getDatabase(), 'users/' + auth.currentUser.uid + '/' + 'project/' + clicked_id);
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
                            get(child(dbRef, 'users/' + auth.currentUser.uid + '/' + 'project/' + clicked_id + "/likesUid")).then((snapshot) => {
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
                                    var myPath = ref(getDatabase(), 'users/' + auth.currentUser.uid + '/' + 'project/' + clicked_id + "/likesUid/" + auth.currentUser.uid);
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
                                        updates['users/' + auth.currentUser.uid + '/' + 'project/' + clicked_id+ '/likeCount'] = c;
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
                                    set(ref(getDatabase(), 'users/' + auth.currentUser.uid + '/' + 'project/' + clicked_id + "/likesUid/" + auth.currentUser.uid), {
                                        [a] : "",
                                    });
                                    change(a);
                                    function change (){
                                        const updates = {};
                                        updates[getDatabase(), 'users/' + auth.currentUser.uid + '/' + 'project/' + clicked_id+ '/likeCount'] = a;
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
                    })
                }
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
                console.error(error);
        });
    }
});

document.getElementById('adPro').addEventListener('click' , function (){
    let uid = auth.currentUser.uid;
    let username = auth.currentUser.displayName;
    let url = document.getElementById('url').src;
    let git = document.getElementById('link').value;
    let title = document.getElementById('nameP').value;
    const newProjectKey = push(child(ref(database), 'projects')).key;
    writeNewProject(uid , username , url , title, git , newProjectKey);
});
function writeNewProject(uid, username, picture, title , proGithub , key) {
    const db = getDatabase();
    set(ref(db, 'projects/' + key), {
        author: username,
        uid: uid,
        title: title,
        likeCount: 0,
        proGithub: proGithub,
        authorPic: picture,
        likesUid: {0 : ""},
        commentCount: 0,
        comments: {0 : ""}
  });
  set(ref(db, 'users/' + uid + '/' + 'project/' + key), {
    author: username,
    uid: uid,
    title: title,
    likeCount: 0,
    authorPic: picture,
    proGithub: proGithub,
    likesUid: {0 : ""}
});
}
