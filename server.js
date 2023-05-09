const express = require('express'); //Line 1
const path = require('path');
const app = express(); //Line 2
const cors = require('cors');
require("dotenv").config({path:"./config.env"});
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

const dbo = require("./db/conn");

/*
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});*/


// This displays message that the server running and listening to specified port
app.listen(port, async () => {
    console.log(`Listening on port ${port}`);
    await dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });    
    console.log(`Server is running on port: ${port}`);
}); //Line 6