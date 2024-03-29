const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

//BrightSpace API whomai: {"Identifier":"1163","FirstName":"Zach","LastName":"Medendorp","Pronouns":null,"UniqueName":"zmedendorp@branksome.on.ca","ProfileIdentifier":"FhoF5s161j"}
//GET /d2l/api/lp/(version)/enrollments/myenrollments/(orgUnitId)


/*
User
  ID:
  firstName:
  lastName:
  email:
  roleID:
  favPrompts: [...promptIDs]
*/

// This section will help you get a list of all the User records.
recordRoutes.route("/users").get(async function (req, response) {
    let db_connect = dbo.getDb();

    db_connect
      .collection("Users") 
      .find({})
      .toArray()
      .then((data) => {
        //console.log(data);
        response.json(data);
      });
  
  });

// Get user by Brightspace ID(Identifier) also can Check if User Exists(ie. needs to make an account)
recordRoutes.route("/users/get/:ID").get(async function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { ID: req.params.ID };
    db_connect
      .collection("Users") 
      .findOne(myquery)
      .then((data) => {
        //console.log(data);
        response.json(data);
      });
  
  });

//Create or Update a User
recordRoutes.route("/users/upsert").post(async function (req, response) {
    let db_connect = dbo.getDb();
    //requiresm req.body.ID for query, and req.body.userObject with fields to be upserted
    let myquery = {email: req.body.ID}; //users have an ID from Brightspace called Identifier

    /* userObject //BrightSpace API whomai: {"Identifier":"1163","FirstName":"Zach","LastName":"Medendorp","Pronouns":null,"UniqueName":"zmedendorp@branksome.on.ca","ProfileIdentifier":"FhoF5s161j"}
      ID:
      firstName:
      lastName:
      email:
      roleID:
      favPrompts: [...promptIDs]
    */

    let myobj = {$set: req.body.userObject};

    let options = {upsert : true};

    let result = await db_connect.collection("Users").updateOne(myquery, myobj, options);
    response.send(result).status(204);
});

///PROMPTS///

/*
Prompts
  promptID:
  prompt:
  authorID:
  public: true/false
  numFavs:
  tags: []
  dateCreated:
  lastEditDate:
*/

//get all prompts
recordRoutes.route("/prompts").get(async function (req, response) {
  let db_connect = dbo.getDb();

  db_connect
    .collection("Prompts") 
    .find({})
    .toArray()
    .then((data) => {
      //console.log(data);
      response.json(data);
    });

});

//get prompts by ID(array) used to get user favPrompts
recordRoutes.route("/prompts/get/:IDs").get(async function (req, response) {
  let db_connect = dbo.getDb();
  //IDs are sent as encodeURIComponent(JSON.stringify(IDs)), which are an array
  let promptIDs = JSON.parse(req.params.IDs);
  let myquery = { promptID: {$in: promptIDs} };
  db_connect
    .collection("Prompts") 
    .find(myquery)
    .then((data) => {
      //console.log(data);
      response.json(data);
    });

});

//Add new Prompt
recordRoutes.route("/prompts/add").post(async function (req, response) {
  let db_connect = dbo.getDb();

  /* 
    _id:         //generated by MongoDB _id : ObjectID('...')
    prompt:
    authorID:
    public: true/false
    numFavs:
    tags: []
    dateCreated:
    lastEditDate:
  */

  let myobj = req.body.promptObject;

  let result = await db_connect.collection("Prompts").insertOne(myobj);
  response.send(result).status(204);
});

//Update a Prompt
recordRoutes.route("/prompts/update").post(async function (req, response) {
  let db_connect = dbo.getDb();
  //requires req.body.promptID, and req.body.promptObject which contains the fields to be updated
  let myquery = {"_id": new ObjectId(req.body.promptObject._id)}; //generated by MongoDB _id : ObjectID('...')

  /* 
    _id: promptID
    prompt:
    authorID:
    public: true/false
    numFavs:
    tags: []
    dateCreated:
    lastEditDate:
  */
  delete req.body.promptObject._id;
  let myobj = {$set: req.body.promptObject};

  let options = {upsert : false};

  let result = await db_connect.collection("Prompts").updateOne(myquery, myobj, options);
  response.send(result).status(204);
});

recordRoutes.route("/prompts/delete/:ID").get(async function (req, response) {
  let db_connect = dbo.getDb();

  let myquery = { "_id": new ObjectId(req.params.ID)};
  db_connect
    .collection("Prompts") 
    .deleteOne(myquery)
    .then((data) => {
      //console.log(data);
      response.json(data);
    });

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