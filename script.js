import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    onSnapshot,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const firebaseConfig = {
    apiKey: 'AIzaSyBQ9hUI0wwIC_BFpgzrNd_K56rw0f3gejc',
    authDomain: 'noteseverywhere-c3833.firebaseapp.com',
    projectId: 'noteseverywhere-c3833',
    storageBucket: 'noteseverywhere-c3833.appspot.com',
    messagingSenderId: '232580852698',
    appId: '1:232580852698:web:f4bd29e4e724c72a5d2ee3',
    measurementId: 'G-0H8MNPSXTR',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const notesContainer = document.querySelector('.notes-container')
const createBtn = document.querySelector('.btn')

// Create a new note element
function createNoteElement(id, content = '') {
    const noteDiv = document.createElement('div')
    noteDiv.className = 'note'
    noteDiv.dataset.id = id

    const inputBox = document.createElement('p')
    inputBox.className = 'input-box'
    inputBox.setAttribute('contenteditable', 'true')
    inputBox.textContent = content

    




    const img = document.createElement('img')
    img.src = 'Images/delete_icon.jpg'
    img.alt = 'Delete'
    img.className = 'delete-btn';

    img.onclick = () => {
        noteDiv.remove()
        saveNotes()
    }

    
    inputBox.addEventListener('input', () => {
        saveNotes()
    })



    noteDiv.appendChild(inputBox).appendChild(img);
    return noteDiv;
}

// Save all notes to Firestore
async function saveNotes() {
    const notes = []
    document.querySelectorAll('.note').forEach((note) => {
        const content = note.querySelector('.input-box').textContent
        if (content.trim() !== '') {
            notes.push({
                id: note.dataset.id,
                content: content,
            })
        }
    })

    try {
        await setDoc(doc(db, 'notes', 'user1'), { notes })
    } catch (error) {
        console.error('Error saving notes: ', error)
    }
}

// Load notes from Firestore
async function loadNotes() {
    try {
        const docSnap = await getDoc(doc(db, 'notes', 'user1'))
        notesContainer.innerHTML = '' // Clear container first

        if (docSnap.exists()) {
            const data = docSnap.data()
            if (data.notes && data.notes.length > 0) {
                data.notes.forEach((note) => {
                    if (note.content.trim() !== '') {
                        notesContainer.appendChild(
                            createNoteElement(note.id, note.content)
                        )
                    }
                })
            }
        }
    } catch (error) {
        console.error('Error loading notes: ', error)
    }
}

// Initialize the app
function init() {
    createBtn.addEventListener('click', () => {
        const newNoteId = Date.now().toString()
        notesContainer.appendChild(createNoteElement(newNoteId))
    })

    loadNotes()
}

// Start the application
init()
