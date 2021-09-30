import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged ,signOut , updateProfile} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getDatabase, ref, set , get , child , onValue ,remove , update} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getFirestore , collection, doc, setDoc  ,getDocs ,  query, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js"

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
const firestore = getFirestore();
let body = document.getElementById( 'body' );
let msg;
let keys;
onAuthStateChanged(auth, (user) =>{
    if(!user){
        location.replace('login/login.html')
    }else{
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
            const starCountRef = ref(getDatabase(), 'users/' + auth.currentUser.uid + '/messages');
            onValue(starCountRef, (snapshot) => {
                msg = Object.values(snapshot.val());
                keys = Object.keys(snapshot.val());
                allM(msg , keys)
            });
            function allM(msg , keys){
                document.querySelector('.msgs').innerHTML = null;
                let h3 =document.createElement("h3")
                h3.id = "scc";
                h3.onclick = ()=>{
                    document.querySelector(".chat .container").style.display = "block";
                    document.querySelector('.msgs').style.display = "none";
                }
                let i = document.createElement("i");
                i.classList.add("fa", "fa-arrow-left");
                h3.appendChild(i)
                document.querySelector('.msgs').appendChild(h3);
                if(msg){
                    for(var j = 0;j < msg.length ;j++){
                        let div = document.createElement("div");
                        div.classList.add("row");
                        let img = document.createElement("img");
                        let col = document.createElement("div");
                        col.classList.add("col");
                        let h2 = document.createElement("h2");
                        h2.id = keys[j]
                        get(child(dbRef, `users/${keys[j]}`)).then((snapshot) => {
                        if (snapshot.exists()) {
                            img.src = snapshot.val().profile_picture;
                            h2.textContent = snapshot.val().fullName;
                        } else {
                            console.log("No data available");
                        }
                        }).catch((error) => {
                        });
                        let p = document.createElement("p");
                        p.innerHTML = msg[j].date;
                        col.appendChild(h2);
                        col.appendChild(p);
                        div.appendChild(img);
                        div.appendChild(col);
                        h2.addEventListener("click", ()=>{
                            localStorage.setItem("userUid" , h2.id);
                            localStorage.setItem("currentUser" , auth.currentUser.uid);
                            location.replace("message.html")
                        })
                        document.querySelector('.msgs').appendChild(div)
                    }
                }
            }
        }
    }
)
function addEvent(id){
    document.getElementById(id).previousElementSibling.addEventListener("click" , (e)=>{
            let p = e.target;
            if(p.nextElementSibling.style.display === "block")
                p.nextElementSibling.style.display = "none";
            else
            p.nextElementSibling.style.display = "block";
    })
    document.getElementById(id).addEventListener("click" , async (e)=>{
        console.log(id)
        const messageRef = doc(firestore ,"chats" , "chats");
        const messageRef1 = doc(messageRef ,"messages", id);
        // Set the "capital" field of the city 'DC'
        await updateDoc(messageRef1, {
          removed: true
        });
    })
}

let send = document.getElementById('send');
send.onclick = async ()=>{
    let message = document.getElementById("message").value;
    if(message === "" || message.trim(" ") === "")
      console.log("error");
    else{
        let userInfo;
        await get(child(ref(getDatabase()), `users/${auth.currentUser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                userInfo = snapshot.val();
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            });
        const db = doc(collection(firestore, "chats") , "chats")
        const querySnapshot = await getDocs(collection(db, "messages"));
        let length=0;
        await querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          length++;
        //   console.log(doc.id, " => ", doc.data());
        });
        console.log(length)
        console.log(querySnapshot)
        let docName = `message${length}`;
        sendMessage(message , userInfo.fullName , auth.currentUser.uid , userInfo.profile_picture , docName)
        document.getElementById("message").value = "";
    }
}
async function sendMessage(message , username , uid , photoUrl , docName){
    const db = doc(collection(firestore, "chats") , "chats")
    await setDoc(doc(db, "messages", docName), {
        username: username,
        message: message,
        photoUrl: photoUrl,
        userUid: uid,
        removed: false
    });
}
let messageExist = [];
let message = [];
let docId ;
const db2 = doc(collection(firestore, "chats") , "chats");
const q1 = query(collection(db2, "messages"));
const unsubscribe1 = onSnapshot(q1, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
        message= change.doc.data();
        console.log(message)
        docId = change.doc.id 
        addMessage(message ,docId)
    }
    if (change.type === "modified") {
        message= change.doc.data();
        console.log(message)
        docId = change.doc.id 
        removed(message ,docId)
    }
  });
});

function addMessage(message , docId){
    if(message.removed === false){
        if(message){
            if(message.userUid === auth.currentUser.uid){
                let div = document.createElement("div");
                div.classList.add("usms");
                let span = document.createElement("span");
                span.innerHTML = message.username;
                let img = document.createElement("img");
                img.src = message.photoUrl;
                let p = document.createElement("p");
                p.classList.add("message" , "user_message");
                p.innerHTML = message.message;
                let icon = document.createElement("i");
                icon.classList.add("fa" , "fa-trash-o");
                icon.title ="Remove message";
                icon.setAttribute("style" , `align-self: center;font-size: 30px;color: #f32e1f; margin-right: 5px; margin-bottom: 7px; display: none; cursor: pointer;`);
                icon.id = docId;
                div.appendChild(span);
                div.appendChild(img);
                div.appendChild(p);
                div.appendChild(icon);
                body.appendChild(div);
                addEvent(docId);
            }else{
                let div1 = document.createElement("div");
                div1.classList.add("ms");
                let span1 = document.createElement("span");
                span1.innerHTML = message.username;
                let img1 = document.createElement("img");
                img1.src = message.photoUrl;
                let p1 = document.createElement("p");
                p1.classList.add("message");
                p1.innerHTML = message.message;
                let icon = document.createElement("i");
                icon.setAttribute("style" , ` display: none;`);
                icon.id = docId;
                div1.appendChild(span1);
                div1.appendChild(img1);
                div1.appendChild(p1);
                div1.appendChild(icon)
                body.appendChild(div1);
            }
        }
    }else{
        if(message.userUid === auth.currentUser.uid){
            let div = document.createElement("div");
            div.classList.add("usms");
            let span = document.createElement("span");
            span.innerHTML = message.username;
            let img = document.createElement("img");
            img.src = message.photoUrl;
            let p = document.createElement("p");
            p.classList.add("message_removed" , "user_message");
            p.innerHTML = "Message removed";
            div.appendChild(span);
            div.appendChild(img);
            div.appendChild(p);
            body.appendChild(div);
        }else{
            let div1 = document.createElement("div");
            div1.classList.add("ms");
            let span1 = document.createElement("span");
            span1.innerHTML = message.username;
            let img1 = document.createElement("img");
            img1.src = message.photoUrl;
            let p1 = document.createElement("p");
            p1.classList.add("message" ,"message_removed");
            p1.innerHTML = p1.innerHTML = "Message removed";;
            div1.appendChild(span1);
            div1.appendChild(img1);
            div1.appendChild(p1);
            body.appendChild(div1);
        }
    }
    document.getElementById( 'body' ).scrollTo( 0, document.getElementById( 'body' ).scrollHeight );
}
function removed(message , docId){
    let parent = document.getElementById(docId).parentElement;
    parent.innerHTML = ""
    if(message.userUid === auth.currentUser.uid){
        let span = document.createElement("span");
        span.innerHTML = message.username;
        let img = document.createElement("img");
        img.src = message.photoUrl;
        let p = document.createElement("p");
        p.classList.add("message_removed" , "user_message");
        p.innerHTML = "Message removed";
        parent.appendChild(span);
        parent.appendChild(img);
        parent.appendChild(p);
        
    }else{
        let span1 = document.createElement("span");
        span1.innerHTML = message.username;
        let img1 = document.createElement("img");
        img1.src = message.photoUrl;
        let p1 = document.createElement("p");
        p1.classList.add("message" ,"message_removed");
        p1.innerHTML = p1.innerHTML = "Message removed";;
        parent.appendChild(span1);
        parent.appendChild(img1);
        parent.appendChild(p1);
    }
}
document.getElementById("signOut").onclick = ()=>{
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}
document.getElementById('userChat').onclick = ()=>{
    document.querySelector(".chat .container").style.display = "none";
    document.querySelector('.msgs').style.display = "Block";
}
document.getElementById('scc').onclick = ()=>{
    document.querySelector(".chat .container").style.display = "block";
    document.querySelector('.msgs').style.display = "none";
}
