import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged ,signOut , updateProfile} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getDatabase, ref, set , get , child , remove , update} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getFirestore , collection, doc, setDoc  ,getDocs ,  query, updateDoc, onSnapshot ,addDoc } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js"

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
let Uid = localStorage.getItem("userUid");
let currentUser = localStorage.getItem("currentUser");
if(Uid == null || typeof Uid == "undefined" || currentUser == null || typeof currentUser == "undefined"){
    location.replace("members.html");
}
await onAuthStateChanged(auth, async (user) =>{
    if(!user){
        location.replace('login/login.html')
    }else{
        const dbRef = ref(database);
        await get(child(dbRef, `users/${Uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            nb = snapshot.val();
            document.getElementById("userName").innerHTML = nb.fullName;
            document.getElementById("userPhoto").src = nb.profile_picture;
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        
        });
        await get(child(dbRef, `users/${auth.currentUser.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                document.documentElement.style.setProperty('--prColor' , snapshot.val().themeColor);
                document.documentElement.style.setProperty('--btnBg', `${snapshot.val().themeColor}a8`);
                document.documentElement.style.setProperty('--brBtn', `${snapshot.val().themeColor}e0`);
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            
            });
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
        const messageRef = doc(firestore ,"chats" , currentUser);
        const messageRef1 = doc(messageRef ,Uid, id);
        // Set the "capital" field of the city 'DC'
        await updateDoc(messageRef1, {
          removed: true
        });
        const messageRef2 = doc(firestore ,"chats" ,Uid );
        const messageRef3 = doc(messageRef2 , currentUser, id);
        // Set the "capital" field of the city 'DC'
        await updateDoc(messageRef3, {
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
        const db = doc(collection(firestore, "chats") , auth.currentUser.uid)
        const querySnapshot = await getDocs(collection(db, Uid));
        let length=0;
        await querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          length++;
        //   console.log(doc.id, " => ", doc.data());
        });
        console.log(length)
        console.log(querySnapshot)
        let docName = `message${length}`;
        sendMessage(message , userInfo.fullName , auth.currentUser.uid , userInfo.profile_picture , docName , Date().slice(0, 21))
        document.getElementById("message").value = "";
    }
}
async function sendMessage(message , username , uid , photoUrl , docName , date){
    const db = doc(collection(firestore, "chats") , currentUser)
    await setDoc(doc(db, Uid, docName), {
        username: username,
        message: message,
        photoUrl: photoUrl,
        userUid: uid,
        removed: false,
        date: date
    });
    const db1 = doc(collection(firestore, "chats") , Uid)
    await setDoc(doc(db1, currentUser, docName), {
        username: username,
        message: message,
        photoUrl: photoUrl,
        userUid: uid,
        removed: false,
        date: date
    });
    set(ref(getDatabase(), 'users/' + currentUser + '/messages/' + Uid), {
        date: date
    });
    set(ref(getDatabase(), 'users/' + Uid + '/messages/' + currentUser ), {
        date: date
    });
}
let messageExist = [];
let message = [];
let docId ;
console.log(currentUser)
const db2 = doc(collection(firestore, "chats") , currentUser);
const q1 = query(collection(db2, Uid));
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
                span.innerHTML = message.date;
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
                span1.innerHTML = message.date;
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
            span.innerHTML = message.date;
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
            span1.innerHTML = message.date;
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
        span.innerHTML = message.date;
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
        span1.innerHTML = message.date;
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
