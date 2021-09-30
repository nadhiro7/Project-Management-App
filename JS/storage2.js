import { getStorage , ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-storage.js";


// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

let chooseP = document.getElementById('image');
chooseP.addEventListener('change', function (t){
    var file = t.target.files[0];
    if(file){
        let reader = new FileReader();
        let ph = document.getElementById('ph_pro');
        reader.addEventListener("load" , function(){
            ph.src = this.result;
        })
        reader.readAsDataURL(file);
    }
})

chooseP.addEventListener('change', handleFileSelect, false);



function handleFileSelect(event){
        const metadata = {
            contentType: 'image'
        };
        var file = event.target.files[0];
        const storageRef = ref(storage, 'profilesPhotos/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on('state_changed',
    (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        document.getElementById('up').innerHTML = 'Upload is ' + Math.round(progress) + '% done';
        document.getElementById('edit').setAttribute("disabled" , "");
        if(progress === 100){
            document.getElementById('up').innerHTML = 'please wait 20s';
            setTimeout(() => {
                document.getElementById('edit').removeAttribute("disabled");
                document.getElementById('up').innerHTML = 'photo upload is done';
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