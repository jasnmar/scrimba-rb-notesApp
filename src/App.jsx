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
    const [tmpNoteText, setTmpNoteText] = useState()

    const currentNote = 
    notes.find(note => note.id === currentNoteId) || notes[0]

    /**
     * Challenge:
     * 1. Set up a new state variable called `tempNoteText`. Initialize 
     *    it as an empty string
     * 2. Change the Editor so that it uses `tempNoteText` and 
     *    `setTempNoteText` for displaying and changing the text instead
     *    of dealing directly with the `currentNote` data.
     * 3. Create a useEffect that, if there's a `currentNote`, sets
     *    the `tempNoteText` to `currentNote.body`. (This copies the
     *    current note's text into the `tempNoteText` field so whenever 
     *    the user changes the currentNote, the editor can display the 
     *    correct text.
     * 4. TBA
     */

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateNote(tmpNoteText)

        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tmpNoteText])


    //Adds a note with a unique id (nanoid) to the list
    //of notes
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id);
    }

    useEffect(()=> {
        if(currentNote) {
            setTmpNoteText(currentNote.body)
        }
    }, [currentNote])

    useEffect(()=> {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // sync local notes with snapshot
            console.log("Snapshot Happening")
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            notesArr.sort((note, nextNote) => { 
                return note.updatedAt < nextNote.updatedAt ? 1 : -1
            })
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
        console.log('text:', text)
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, 
            {body: text, updatedAt: Date.now()}, 
            {merge: true})
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
                        tmpNoteText={tmpNoteText}
                        setTmpNoteText={setTmpNoteText}
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
