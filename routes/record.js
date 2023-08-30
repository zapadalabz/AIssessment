const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the records.
recordRoutes.route("/users").get(async function (req, response) {
    let db_connect = dbo.getDb();

    db_connect
      .collection("User") 
      .find({})
      .toArray()
      .then((data) => {
        //console.log(data);
        response.json(data);
      });
  
  });

  // Check if User Exists(ie. needs to make an account)
recordRoutes.route("/userExists/:email").get(async function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    db_connect
      .collection("User") 
      .findOne(myquery)
      .then((data) => {
        //console.log(data);
        response.json(data);
      });
  
  });

  //Create new User
recordRoutes.route("/users/update").post(async function (req, response) {
    let db_connect = dbo.getDb();

    let myquery = {email: req.body.email}; //users have a unique email

    let myobj = {$set:{
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
    }};

    let options = {upsert : true};

    let result = await db_connect.collection("User").updateOne(myquery, myobj, options);
    response.send(result).status(204);
});



//TASKS///

  //Create new Task
  recordRoutes.route("/tasks/update").post(async function (req, response) {
    let db_connect = dbo.getDb();

    let myquery = {email: req.body.email}; //users have a unique email

    let myobj = {$set:{
        title: req.body.title,
        system: req.body.system,
        prompt: req.body.prompt,
        email: req.body.email,
        model: req.body.model,
        xlsx: req.body.xlsx,
        keywords: req.body.keywords
    }};

    let options = {upsert : true};

    let result = await db_connect.collection("Task").updateOne(myquery, myobj, options);
    response.send(result).status(204);
});

recordRoutes.route("/tasks/getByEmail/:email").get(async function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { email: req.params.email };
  db_connect
    .collection("Task") 
    .find(myquery)
    .then((data) => {
      //console.log(data);
      response.json(data);
    });

});

module.exports = recordRoutes;