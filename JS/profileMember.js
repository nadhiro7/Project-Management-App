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
let uid = localStorage.getItem("uid");
if(uid == null || typeof uid == "undefined"){
    location.replace("members.html");
}
onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.replace('login/login.html')
    } else {
        if(uid == auth.currentUser.uid){
            location.replace("members.html");
        }
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
        let userInfo;
        const dbRef = ref(getDatabase());
        console.log(auth.currentUser.uid)
        document.getElementById("message").onclick = ()=>{
            localStorage.setItem("userUid" , uid);
            localStorage.setItem("currentUser" , auth.currentUser.uid);
            location.replace("message.html")
        }
        get(child(dbRef, `users/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                userInfo = snapshot.val()
                console.log(userInfo);
                document.getElementById("name").innerHTML = userInfo.fullName;
                document.getElementById("usn").innerHTML = userInfo.username;
                document.title = `SCC | ${userInfo.fullName}`;
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
                    icon.innerHTML = pr[i].likeCount;
                    anchor.setAttribute("href" , pr[i].proGithub);
                    anchor.innerHTML = pr[i].title;
                    childDiv.appendChild(anchor);
                    childDiv.appendChild(unp);
                    firstDiv.appendChild(secondImg);
                    firstDiv.appendChild(childDiv);
                    div.appendChild(firstDiv);
                    div.appendChild(icon);
                    icon.setAttribute("id" , Object.keys(userInfo.project)[i] + i);
                    firstImg.addEventListener("click",()=>{
                        let _id =  icon.id;
                        _id = _id.slice(0 , _id.length-1);
                        localStorage.setItem('projectId',_id);
                        location.replace("showProject.html");
                    })
                    parent.appendChild(firstImg);
                    parent.appendChild(div);
                    projects.appendChild(parent)
                    }
                    let likes = document.querySelectorAll(".like").forEach((ele, index)=>{
                        ele.addEventListener("click", function()
                        {
                            let clicked_id = ele.id;
                            clicked_id = clicked_id.slice(0 , clicked_id.length-1);
                            let b = clicked_id;
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
                                    set(ref(getDatabase(), 'users/' + auth.currentUser.uid + "/projectsLiked/" + clicked_id), {
                                        1 : "",
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