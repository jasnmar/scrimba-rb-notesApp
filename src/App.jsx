import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"


export default function App() {

    const [notes, setNotes] = useState(
        () => JSON.parse(localStorage.getItem('notes')) || []);
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0]?.id) || ""
    );


    const currentNote = 
    notes.find(note => note.id === currentNoteId) || notes[0]

    //Adds a note with a unique id (nanoid) to the list
    //of notes
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here",
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }


    useEffect(()=> {
        localStorage.setItem('notes', JSON.stringify(notes))
    },[notes])

    //Checks all of the notes against their ID
    //if the ID matches, update the text
    function updateNote(text) {

        setNotes((oldNotes) => {
            const newNotesArray = []
            for(let note of oldNotes) {
                note.id === currentNoteId ? 
                    newNotesArray.unshift(note = {...note, body: text}) :
                    newNotesArray.push(note)
            }
            return newNotesArray
        });
    }
    
    function deleteNote(event, noteId) {
        event.stopPropagation()
        const filteredNotesArray = notes.filter((note) => note.id != noteId)
        setNotes(filteredNotesArray)
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
                    {currentNoteId && notes.length > 0 && (
                        <Editor
                            currentNote={currentNote}
                            updateNote={updateNote}
                        />
                    )}
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
