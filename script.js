// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

// ✅ Firebase Configuration (Fixed storageBucket)
const firebaseConfig = {
    apiKey: 'AIzaSyBQ9hUI0wwIC_BFpgzrNd_K56rw0f3gejc',
    authDomain: 'noteseverywhere-c3833.firebaseapp.com',
    projectId: 'noteseverywhere-c3833',
    storageBucket: 'noteseverywhere-c3833.appspot.com', // ✅ Fixed this
    messagingSenderId: '232580852698',
    appId: '1:232580852698:web:f4bd29e4e724c72a5d2ee3',
    measurementId: 'G-0H8MNPSXTR',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const notesContainer = document.querySelector('.notes-container')
const createBtn = document.querySelector('.btn')

// ✅ Save Notes to Firestore
async function saveNotes(notes) {
    try {
        await setDoc(doc(db, 'notes', 'user1'), { content: notes })
        console.log('Notes saved successfully!')
    } catch (error) {
        console.error('Error saving notes: ', error)
    }
}

// ✅ Load Notes from Firestore
async function loadNotes() {
    try {
        const docSnap = await getDoc(doc(db, 'notes', 'user1'))
        if (docSnap.exists()) {
            notesContainer.innerHTML = docSnap.data().content
        } else {
            console.log('No notes found.')
        }
    } catch (error) {
        console.error('Error loading notes: ', error)
    }
}

// ✅ Load notes on page load
window.addEventListener('DOMContentLoaded', async () => {
    await loadNotes()
})

// ✅ Save notes on content change or deletion
function attachEventListeners() {
    notesContainer.addEventListener('input', () => {
        saveNotes(notesContainer.innerHTML)
    })

    notesContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.parentElement.remove()
            saveNotes(notesContainer.innerHTML)
        }
    })
}

attachEventListeners()

// ✅ Add new note logic
createBtn.addEventListener('click', () => {
    let inputBox = document.createElement('p')
    let img = document.createElement('img')

    inputBox.className = 'input-box'
    inputBox.setAttribute('contenteditable', 'true')

    img.src = 'Images/delete_icon.jpg'
    img.alt = 'Delete'

    img.onclick = () => {
        inputBox.remove()
        saveNotes(notesContainer.innerHTML)
    }

    notesContainer.appendChild(inputBox).appendChild(img)
    saveNotes(notesContainer.innerHTML)
})
