// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZsVjv92RBNBhpC8CR5487DAVOs8RR-D0",
    authDomain: "davidalanocom.firebaseapp.com",
    projectId: "davidalanocom",
    storageBucket: "davidalanocom.appspot.com",
    messagingSenderId: "2820834762",
    appId: "1:2820834762:web:16944cf2e5cf8876263b33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var emailsDB = collection(getFirestore(app), "mail-list");

export function addEntry(name, email) {
    console.log(addDoc(emailsDB, { name: name, email: email, timestamp: new Date() }));
}