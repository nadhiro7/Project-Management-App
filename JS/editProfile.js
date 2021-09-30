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
let Skills = document.getElementById("sk");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.replace('login/login.html')
    } else {
    let userInfo;
    const uid = user.uid;
    console.log(uid)
        const dbRef = ref(database);
        get(child(dbRef, `users/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                userInfo = snapshot.val();
                document.getElementById("userName").innerHTML = userInfo.fullName;
                document.getElementById("userPhoto").src = userInfo.profile_picture;
                document.getElementById("name").value = userInfo.username;
                document.getElementById('ph_pro').src = userInfo.profile_picture;
                document.getElementById('bio').value = userInfo.bio;
                document.getElementById("nm").innerHTML = userInfo.username;
                document.documentElement.style.setProperty('--prColor' , userInfo.themeColor);
                document.documentElement.style.setProperty('--btnBg', `${userInfo.themeColor}a8`);
                document.documentElement.style.setProperty('--brBtn', `${userInfo.themeColor}e0`);
                if(userInfo.facebookLink === "#")
                    document.getElementById('facebook').value = "";
                else
                    document.getElementById('facebook').value = userInfo.facebookLink;
                if(userInfo.githubLink === "#")
                    document.getElementById('github').value = "";
                else
                    document.getElementById('github').value = userInfo.githubLink;
                if(userInfo.instagramLink === "#")
                    document.getElementById('instagram').value = "";
                else
                    document.getElementById('instagram').value = userInfo.instagramLink;

                if(userInfo.skills === ""){
                    Skills.innerHTML = "Add skills";
                }else{
                    let sk = Object.values(userInfo.skills);
                    for(var i = 0 ; i < sk.length ; i++){
                        let li = document.createElement('li');
                        li.textContent = sk[i];
                        let remove = document.createElement( "i" );
                        remove.setAttribute( "class", "fa fa-times rm" );
                        remove.setAttribute( "style", "font-size: 20px;color: var(--prColor);" );
                        remove.setAttribute( "onclick", "remove(this.id)" );
                        remove.setAttribute( "id", `${i}` );
                        li.appendChild(remove);
                        Skills.appendChild(li);
                    }
                }
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
document.getElementById('edit').addEventListener('click' , function (){
    let usernm = document.getElementById('name').value;
    if(usernm === "" || usernm === null || usernm.includes(" ")){
        usernm = document.getElementById('nm').textContent;
    }else{
        usernm = document.getElementById('name').value;
    }
    let bio = document.getElementById('bio').value;
    let facebook = document.getElementById('facebook').value;
    if(facebook === "" || facebook === null || !facebook.includes("facebook")){
        facebook = "#";
    }
    let instagram = document.getElementById('instagram').value;
    if(instagram === "" || instagram === null || !instagram.includes("instagram")){
        instagram = "#";
    }
    let github = document.getElementById('github').value;
    if(github === "" || github === null || !github.includes("github")){
        github = "#";
    }
    let photoProfile;
    if(document.getElementById("url").src == null || document.getElementById("url").src == ""){
        get(child(ref(getDatabase()), `users/${auth.currentUser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                photoProfile = snapshot.val().profile_picture;
                console.log(photoProfile)
            } else {
            console.log("No data available");
            }
        }).catch((error) => {
        });
    }else{
        photoProfile = document.getElementById("url").src;
    }
    change(usernm , bio , facebook , github, instagram , photoProfile);
        function change (u , b , f, g, i , p){
            const updates = {};
            updates[getDatabase(), 'users/' + auth.currentUser.uid + '/username' ] = u;
            updates[getDatabase(), 'users/' + auth.currentUser.uid + '/bio' ] = b;
            updates[getDatabase(), 'users/' + auth.currentUser.uid + '/facebookLink' ] = f;
            updates[getDatabase(), 'users/' + auth.currentUser.uid + '/githubLink' ] = g;
            updates[getDatabase(), 'users/' + auth.currentUser.uid + '/instagramLink' ] = i;
            if(document.getElementById("url").src == p){
                updates[getDatabase(), 'users/' + auth.currentUser.uid + '/profile_picture' ] = p;
            }
            return update(ref(getDatabase()), updates);
        }
        location.reload();
});
document.getElementById("skillsChange").onclick = ()=>{
    let list = document.getElementById('sk');
    var obj = {};
    for (var i = 0; i < list.children.length; ++i){
        obj[i] = list.children[i].textContent;
    }
    writeSkills(obj);
    function writeSkills(skills) {
        const db = getDatabase();
        const updates = {};
        updates[getDatabase(), 'users/' + auth.currentUser.uid + '/skills'] = skills;
        return update(ref(db), updates);
    }
    document.getElementById('d').textContent = "Change saved";
    setTimeout(() => {
        document.getElementById('d').textContent = "";
    }, 10000);
}