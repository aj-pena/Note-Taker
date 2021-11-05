const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.listen(PORT, ()=> 
    console.log(`Server app listening at http://localhost:${PORT}`)
);

app.get('/notes', (req,res) => 
    res.sendFile(path.join(_dirname,'public/notes.html'))
);
