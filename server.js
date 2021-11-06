const express = require('express');
const path = require('path');
const eNotes = require('./db/db.json');
const uuid = require('./helpers/uuid');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

// Setting Express app to handle data parsing
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// GET route for rendering notes.html (page 2)
app.get('/notes', (req,res) => 
    res.sendFile(path.join(__dirname,'public/notes.html'))
);
// GET route for retrieving existing notes
app.get('/api/notes', (req,res) => res.json(eNotes));

// POST route for saving notes
app.post('/api/notes', (req,res) =>{
    console.log(req.body);
// log that POST request was reveived
    console.info(`${req.method} request received to add a note`)
    const { title, text } = req.body;

    if(title && text){
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        
        
        
        //reading file
        let dbData = fs.readFileSync('./db/db.json','utf8', function (err,data){
           console.log(data);
            return data;
        
          });
        console.log('dbData:',dbData);
        const parsedData = JSON.parse(dbData);
        parsedData.push(newNote);
          // stringifying data
        const newNoteString = JSON.stringify(parsedData);

        // write string to a file
        fs.writeFileSync('./db/db.json', newNoteString, (err) =>
            err ? console.error(err) : console.log(
                `New note for ${newNote.title} has been written to JSON file`
            )
        );
        
        const response = {
            status: 'success',
            body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting new note');
    }
});
// DELETE route for specific note
app.delete('/api/notes/:id',(req,res) =>{
    // iterate through notes to look for id
    for(let i=0;i<eNotes.length;i++){
        if(req.params.id === eNotes[i].id){
            eNotes.splice(i,1);
            const newNoteString = JSON.stringify(eNotes);
            fs.writeFile('./db/db.json', newNoteString, (err) =>
            err ? console.error(err) : console.log(
                `Note with id ${req.params.id} has been deleted from JSON file`
            )
        );
        }
        
        
    }
    // if requested id not found
    return res.json('Note not found: not possible to erase');   
});

// GET route for all existing notes
// app.get('/notes/existing', (req, res)=> res.json(eNotes));

// GET route for specific existing note
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
res.sendFile(path.join(__dirname,'public/index.html'))
);


// Connections listener
app.listen(PORT, ()=> 
    console.log(`Server app listening at http://localhost:${PORT}`)
);

