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

  // This section will help you get a list of all the records.
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

    let myquery = {"email": req.body.email}; //users have a unique email

    let myobj = {$set:{
        name: req.body.name,
        role: req.body.role,
        email: req.body.email,
    }};

    let options = {upsert : true};

    db_connect.collection("User").updateOne(myquery, myobj, options, function(err, res) {
        if (err) throw err;
        console.log("updated");
        response.json(res);
    });
});

module.exports = recordRoutes;