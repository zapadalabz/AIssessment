const express = require('express'); //Line 1
const app = express(); //Line 2
const cors = require('cors');
require("dotenv").config({path:"./config.env"});
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

const dbo = require("./db/conn");

// This displays message that the server running and listening to specified port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    dbo.connectToServer(function (err) {
        if (err) console.errorr(err);
    });    
    console.log(`Server is running on port: ${port}`);
}); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11