// Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBQ9hUI0wwIC_BFpgzrNd_K56rw0f3gejc',
    authDomain: 'noteseverywhere-c3833.firebaseapp.com',
    projectId: 'noteseverywhere-c3833',
    storageBucket: 'noteseverywhere-c3833.appspot.com', // Fixed storage bucket
    messagingSenderId: '232580852698',
    appId: '1:232580852698:web:f4bd29e4e724c72a5d2ee3',
    measurementId: 'G-0H8MNPSXTR',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* Signup Function */
function signup() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirmpassword').value; // Fixed ID mismatch

    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all the deets!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords don’t match');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Account created successfully! 🎉');
            window.location.href = 'login.html'; // Redirect only after successful signup
        })
        .catch((error) => {
            alert(error.message);
        });
}

/* Login Function */
function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (!email || !password) {
        alert('One or two fields missing');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Portal open!');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert('Portal can’t be accessed - Invalid creds');
        });
}

window.signup = signup;
window.login = login;
