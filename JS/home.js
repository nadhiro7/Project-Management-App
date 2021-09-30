
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

await onAuthStateChanged(auth, (user) => {
    if (!user) {
      location.replace('login/login.html')
    } else {
      const uid = user.uid;
      const dbRef = ref(database);
      document.querySelector('.dots').id = uid;
      get(child(dbRef, `users/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            nb = snapshot.val();
            document.getElementById("userName").innerHTML = nb.fullName;
            document.getElementById("userPhoto").src = nb.profile_picture;
            document.getElementById("name").innerHTML = nb.fullName;
            document.documentElement.style.setProperty('--prColor' , nb.themeColor);
            document.documentElement.style.setProperty('--btnBg', `${nb.themeColor}a8`);
            document.documentElement.style.setProperty('--brBtn', `${nb.themeColor}e0`);
            get(child(dbRef, `projects/`)).then((snapshot) => {
              if (snapshot.exists()) {
            
                let pr = Object.values(snapshot.val());
                let id = Object.keys(snapshot.val());
                console.log(pr);
                if(pr == "" || pr == null){
                  document.querySelector(".projects .container").appendChild("no projects to show");
                }else{
                  let projects = document.querySelector(".projects .container");
                for(var i = 0 ;i < pr.length ; i++){
                  if(i>=6){
                    break;
                  }
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
                firstImg.addEventListener("click",()=>{
                  localStorage.setItem('projectId',icon.id);
                  location.replace("showProject.html");
              })
                parent.appendChild(firstImg);
                parent.appendChild(div);
                projects.appendChild(parent)
                console.log(parent);
                }
                let likes = document.querySelectorAll(".like").forEach((ele, index)=>{
                    ele.addEventListener("click", function()
                    {
                        let clicked_id = ele.id;
                        clicked_id = clicked_id;
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
                })
                }
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
            
            });
            var users = new Object();
            var usersUid = [];
            let social = document.querySelectorAll(".sci li a");
            let card = document.querySelectorAll(".card");
            let members =document.querySelector(".members .container");
            get(child(dbRef, `users/`)).then((snapshot) => {
              if (snapshot.exists()) {
                users = snapshot.val();
                usersUid = Object.keys(users);
                for(var j = 0 ; j < usersUid.length ; j++){
                  if(j>=3){
                    break; 
                  }
                  card[j].firstElementChild.firstElementChild.firstElementChild.src = users[`${usersUid[j]}`][`profile_picture`];
                  card[j].firstElementChild.lastElementChild.firstElementChild.textContent = users[`${usersUid[j]}`][`fullName`];
                  card[j].firstElementChild.lastElementChild.firstElementChild.id = usersUid[j];
                  let usn = document.createElement("span");
                  usn.innerHTML = users[`${usersUid[j]}`][`username`];
                  card[j].firstElementChild.lastElementChild.firstElementChild.appendChild(usn);
                  card[j].lastElementChild.children[0].firstElementChild.href = users[`${usersUid[j]}`][`facebookLink`];
                  card[j].lastElementChild.children[1].firstElementChild.href = users[`${usersUid[j]}`][`instagramLink`];
                  card[j].lastElementChild.children[2].firstElementChild.href = users[`${usersUid[j]}`][`githubLink`];
                }
                for(var i = 0 ; i < card.length ; i++){
                  if(card[i].firstElementChild.lastElementChild.firstElementChild.firstElementChild.innerHTML === ""){
                    card[i].style.display = "none";
                    console.log("done");
                  }else{
                    console.log("error");
                    console.log(card[i].firstElementChild.firstElementChild.firstElementChild.src)
                  }
                }
              } else {
                console.log("No data available");
              }
            }).catch((error) => {

});
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
  
        });

    }
});

document.getElementById("signOut").onclick = ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
}
let clrBtn = document.querySelector(".dots")
clrBtn.children[0].onclick =  function (){
    document.documentElement.style.setProperty('--prColor' , "#9c27b0");
    document.documentElement.style.setProperty('--btnBg', '#9c27b0a8');
    document.documentElement.style.setProperty('--brBtn', '#9c27b0e0');
    function writeNewThemeColorData(color){
        const updates = {};
        updates[getDatabase(), 'users/' + auth.currentUser.uid + '/themeColor'] = color; 
        return update(ref(database), updates);
    }
    writeNewThemeColorData('#9c27b0');
}
clrBtn.children[1].onclick = function (){
    document.documentElement.style.setProperty('--prColor' , "#1e2ba4");
    document.documentElement.style.setProperty('--btnBg', '#1e2ba4a8');
    document.documentElement.style.setProperty('--brBtn', '#1e2ba4e0');
    function writeNewThemeColorData(color){
        const updates = {};
        updates[getDatabase(), 'users/' + auth.currentUser.uid + '/themeColor'] = color; 
        return update(ref(database), updates);
    }
    writeNewThemeColorData("#1e2ba4");
}
clrBtn.children[2].onclick = function (){
    document.documentElement.style.setProperty('--prColor' , "#e91e63");
    document.documentElement.style.setProperty('--btnBg', '#e91e63a8');
    document.documentElement.style.setProperty('--brBtn', '#e91e63e0');
    function writeNewThemeColorData(color){
        const updates = {};
        updates[getDatabase(), 'users/' + auth.currentUser.uid + '/themeColor'] = color; 
        return update(ref(database), updates);
    }
    writeNewThemeColorData("#e91e63");
}
clrBtn.children[3].onclick = function (){
    document.documentElement.style.setProperty('--prColor' , "#ff5722");
    document.documentElement.style.setProperty('--btnBg', '#ff5722a8');
    document.documentElement.style.setProperty('--brBtn', '#ff5722e0');
    function writeNewThemeColorData(color){
        const updates = {};
        updates[getDatabase(), 'users/' + auth.currentUser.uid + '/themeColor'] = color; 
        return update(ref(database), updates);
    }
    writeNewThemeColorData("#ff5722");
}
let prof = document.querySelectorAll('.prof');
prof.forEach((ele)=>{
  ele.addEventListener(("click"), ()=>{
    localStorage.setItem('uid', ele.id);
    location.replace("memberProfile.html");
  })
})