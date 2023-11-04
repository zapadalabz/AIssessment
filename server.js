const express = require('express'); //Line 1
const path = require('path');
const qs = require('qs');

const app = express(); //Line 2
const cors = require('cors');
require("dotenv").config();

const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use(require("./routes/record_hf.js"));
app.use(require("./routes/record_openAI.js"));

app.listen(process.env.PORT||5000, async () => {
  console.log(`Listening on port ${port}`);
    await dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });    
    console.log(`Server is running on port: ${port}`);
});


console.log("before dbo");
const dbo = require("./db/conn");
console.log("after dbo");

// Serve any static files
app.use(express.static(path.join(__dirname, 'client/build')));
console.log("after static");
// Handle React routing, return all requests to React app
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
console.log("after join");

