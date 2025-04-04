// Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js'
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js'

// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBQ9hUI0wwIC_BFpgzrNd_K56rw0f3gejc',
    authDomain: 'noteseverywhere-c3833.firebaseapp.com',
    projectId: 'noteseverywhere-c3833',
    storageBucket: 'noteseverywhere-c3833.appspot.com',
    messagingSenderId: '232580852698',
    appId: '1:232580852698:web:f4bd29e4e724c72a5d2ee3',
    measurementId: 'G-0H8MNPSXTR',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

/* Signup Function */
function signup() {
    let name = document.getElementById('name').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let confirmPassword = document.getElementById('confirmPassword').value

    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all the details!')
        return
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!')
        return
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user
            console.log('User Created:', user)

            // Store user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                notes: '', // Initialize with empty notes
            })

            alert('Account created successfully! 🎉')
            window.location.href = 'login.html' // Redirect to login after success
        })
        .catch((error) => {
            console.error('Signup Error:', error)
            alert(error.message)
        })
}

/* Login Function */
function login() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value

    if (!email || !password) {
        alert('One or two fields missing')
        return
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Portal open!')
            window.location.href = 'notes.html'
        })
        .catch((error) => {
            alert('Portal can’t be accessed - Invalid creds')
        })
}

/* Load Notes for Logged-in User */
async function loadNotes() {
    const user = auth.currentUser
    if (!user) return

    const userDocRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists() && docSnap.data().notes) {
        const notes = docSnap.data().notes

        // Get the notes container and clear previous notes
        const notesContainer = document.getElementById('notes-container')
        notesContainer.innerHTML = ''

        // Display each note
        notes.forEach((note) => {
            const noteElement = document.createElement('p')
            noteElement.textContent = note.content
            noteElement.classList.add('input-box')
            notesContainer.appendChild(noteElement)
        })
    } else {
        console.log('No notes found!')
    }
}

/* Save Notes for Logged-in User */
async function saveNote() {
    const user = auth.currentUser
    if (!user) {
        alert('Please log in first!')
        return
    }

    const noteContent = document.getElementById('notes').value

    // Get existing notes
    const userDocRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(userDocRef)
    let notes = []

    if (docSnap.exists() && docSnap.data().notes) {
        notes = docSnap.data().notes
    }

    // Add new note
    notes.push({ content: noteContent, timestamp: Date.now() })

    // Save back to Firestore
    await setDoc(userDocRef, { notes: notes }, { merge: true })

    alert('Note saved successfully!')
}

// Automatically load user-specific notes when they log in
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadNotes()
    }
})

window.signup = signup
window.login = login
window.saveNote = saveNote
