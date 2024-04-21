import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"


export default function App() {

    const [notes, setNotes] = useState(
        () => JSON.parse(localStorage.getItem('notes')) || []);
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0] && notes[0].id) || ""
    );

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
    
    /**
     * Challenge: complete and implement the deleteNote function
     * 
     * Hints: 
     * 1. What array method can be used to return a new
     *    array that has filtered out an item based 
     *    on a condition?
     * 2. Notice the parameters being based to the function
     *    and think about how both of those parameters
     *    can be passed in during the onClick event handler
     */
    
    function deleteNote(event, noteId) {
        event.stopPropagation()
        // Your code here
    }
    
    //returns the note that matches the currentNoteId
    //which is stored in state
    function findCurrentNote() {
        return (
            notes.find((note) => {
                return note.id === currentNoteId;
            }) || notes[0]
        );
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
                        currentNote={findCurrentNote()}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                    />
                    {currentNoteId && notes.length > 0 && (
                        <Editor
                            currentNote={findCurrentNote()}
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
