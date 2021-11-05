const express = require('express');
const path = require('path');
const eNotes = require('./db/db.json');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.get('/notes', (req,res) => 
    res.sendFile(path.join(_dirname,'public/notes.html'))
);
// GET route for all existing notes
app.get('/notes/existing', (req, res)=> res.json(eNotes));

// GET route for specific note
app.get('/notes/existing/:title', (req, res)=>{
    const requestedNote = req.params.title.toLocaleLowerCase();
    // iterate through notes to look for requested title
    for(let i=0;i<eNotes.length;i++){
        if(requestedNote === eNotes[i].title.toLocaleLowerCase()){
            return res.json(eNotes[i]);
        }
    }
    // if requested title not found
    return res.json('Note not found');
});

// Fallback route
app.get('*', (req, res)=>
     res.send(
        `Make a GET request to <a href="http://localhost:${PORT}/notes/existing">http://localhost:${PORT}/notes/existing</a>`
    )
);


// Connections listener
app.listen(PORT, ()=> 
    console.log(`Server app listening at http://localhost:${PORT}`)
);

