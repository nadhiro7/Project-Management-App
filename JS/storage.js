import { getStorage , ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-storage.js";


// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

let chooseImg = document.getElementById('template');
chooseImg.addEventListener('change', function (f){
    var file = f.target.files[0];
    if(file){
        let reader = new FileReader();
        let img = document.createElement('img');
        reader.addEventListener("load" , function(){
            img.src = this.result;
            img.setAttribute("style" , "width: 99%; height: 99%; margin: auto auto 1% auto; object-fit: cover;")
        })
        reader.readAsDataURL(file);
        document.getElementById('lbl').innerHTML = "";
        document.getElementById('lbl').appendChild(img);
    }
})

chooseImg.addEventListener('change', handleFileSelect, false);



function handleFileSelect(event){
    const metadata = {
        contentType: 'image'
      };
      var file = event.target.files[0];
    const storageRef = ref(storage, 'projectsImages/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    document.getElementById('up').innerHTML = 'Upload is ' + Math.round(progress) + '% done';
    if(progress === 100){
        document.getElementById('up').innerHTML = 'please wait 20s';
        setTimeout(() => {
            document.getElementById('adPro').removeAttribute("disabled");
            document.getElementById('up').innerHTML = 'template upload is done';
        }, 20000);
        
    }
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const img = document.getElementById('url');
        img.setAttribute('src', downloadURL);
    });
  }
);
}