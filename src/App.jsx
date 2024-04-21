import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { doc, addDoc, onSnapshot, deleteDoc, setDoc } from 'firebase/firestore'
import { db, notesCollection } from './firebase'


export default function App() {

    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState("");


    const currentNote = 
    notes.find(note => note.id === currentNoteId) || notes[0]

    //Adds a note with a unique id (nanoid) to the list
    //of notes
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
        };
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id);
    }


    useEffect(()=> {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // sync local notes with snapshot
            console.log("things are changing")
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    },[])

    useEffect(() => {
        if(!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    },[notes])


    //Checks all of the notes against their ID
    //if the ID matches, update the text
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body: text})
    }
    
    async function deleteNote(event, noteId) {
        //event.stopPropagation()
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
        
    }

    return (
        <main>
            {notes.length > 0 ? (
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={notes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                    <Editor
                        currentNote={currentNote}
                        updateNote={updateNote}
                    />
                   
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}
