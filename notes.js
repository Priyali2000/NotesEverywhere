// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js';

// Firebase config
const firebaseConfig = {
    apiKey: 'AIzaSyBQ9hUI0wwIC_BFpgzrNd_K56rw0f3gejc',
    authDomain: 'noteseverywhere-c3833.firebaseapp.com',
    projectId: 'noteseverywhere-c3833',
    storageBucket: 'noteseverywhere-c3833.appspot.com',
    messagingSenderId: '232580852698',
    appId: '1:232580852698:web:f4bd29e4e724c72a5d2ee3',
    measurementId: 'G-0H8MNPSXTR',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Check user authentication
onAuthStateChanged(auth, async (user) => {
    if (user) {
        loadNotes(user.uid);
    } else {
        window.location.href = "index.html"; // Redirect to login if not authenticated
    }
});

// Function to load notes
async function loadNotes(userId) {
    const notesContainer = document.getElementById("notes-container");
    const userDoc = await getDoc(doc(db, "users", userId));

    notesContainer.innerHTML = ""; // Clear existing notes

    if (userDoc.exists()) {
        const notes = userDoc.data().notes || [];

        notes.forEach((noteObj, index) => {
            const noteElement = document.createElement("div");
            noteElement.className = "note-item";

            // Create editable note
            const noteText = document.createElement("p");
            noteText.contentEditable = "true";
            noteText.className = "input-box";
            noteText.textContent = noteObj.content;

            // Auto-save note on edit
            noteText.addEventListener("blur", () => updateNote(userId, index, noteText.textContent));

            // Delete button
            const deleteImg = document.createElement("img");
            deleteImg.src = "Images/delete_icon.jpg";
            deleteImg.alt = "Delete Note";
            deleteImg.onclick = () => deleteNote(userId, index);

            noteElement.appendChild(noteText).appendChild(deleteImg);
            notesContainer.appendChild(noteElement);
        });
    }
}

// Function to add a new note
async function addNote() {
    const user = auth.currentUser;
    if (!user) {
        alert("User not logged in!");
        return;
    }

    const userId = user.uid;
    const userDocRef = doc(db, "users", userId);
    let notes = [];

    try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            notes = userDoc.data().notes || [];
        } else {
            console.log("User document does not exist, creating one...");
            await setDoc(userDocRef, { notes: [] }); // Initialize empty notes
        }

        // Add a new note
        notes.push({ content: "", timestamp: Date.now() });

        // Update Firestore
        await setDoc(userDocRef, { notes }, { merge: true });

        console.log("Note added successfully! ✅");
        loadNotes(userId); // Reload notes

    } catch (error) {
        console.error("Error adding note:", error);
        alert("Failed to add note. Check the console for details.");
    }
}



// Function to update a note when edited
async function updateNote(userId, index, newContent) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) return;

    let notes = userDoc.data().notes || [];
    notes[index].content = newContent; // Update content

    await updateDoc(userDocRef, { notes });
}

// Function to delete a note
async function deleteNote(userId, index) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) return;

    let notes = userDoc.data().notes || [];
    notes.splice(index, 1);

    await updateDoc(userDocRef, { notes });
    loadNotes(userId);
}

// Logout function
function logout() {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
}

window.addNote = addNote;
window.logout = logout;
