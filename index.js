const express = require("express");
const app = express();
const port = process.env.Port || 8080;
const fs = require("fs"); //import fs module #03/31/2020#
let jsonData = require("./todo.json");
let configjson = require("./config.json");
const axios = require("axios");

require("dotenv").config();

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

/* 
      Activity 1

      Complete the following routes to manage a todo list. 

*/
// //#03/31/2020#
// fs.writeFile("readme.txt", "Hey, Write something to me!", err => {
//   if (err) throw err;
//   console.log("File has been written");
// });
// readFile("./readme.txt", "utf-8", (err, data) => {
//   if (err) throw err;
//   console.log(`Here's your file: ${data}`);
// });

//Create a route that will retrieve an activity by its ID and display the information of it (name, status, etc)
app.get("/activity/:id", (req, res) => {
  // //#03/31/2020#
  let todoData = jsonData.myToDoList.find(
    t => t.id === parseInt(req.params.id)
  );
  if (!todoData) {
    res.status(400).send("Sorry, Data not available!");
  }
  res.send(todoData);
});

//Create a route that will insert a new activity
app.post("/activity", (req, res) => {
  //#03/31/2020#
  let todoData = {
    id: jsonData.myToDoList.length + 1,
    item: req.body.item,
    status: req.body.status
  };
  jsonData.myToDoList.push(todoData);
  console.log(JSON.stringify(jsonData));
  fs.writeFile("./todo.json", JSON.stringify(jsonData), err => {
    if (err) throw err;
    console.log("File has been written");
  });
  res.send("Inserted successfully");
});

//Create a route that will edit an existing activity
app.put("/activity/:id", (req, res) => {
  //#03/31/2020#
  let todoData = jsonData.myToDoList.find(
    t => t.id === parseInt(req.params.id)
  );
  if (!todoData) {
    res.status(400).send("Sorry, Data not available!");
  }
  todoData.item = req.body.item;
  todoData.status = req.body.status;

  fs.writeFile("./todo.json", todoData, err => {
    if (err) throw err;
    console.log("File has been written");
  });

  res.send(todoData);
});

/*
    Activity 2

    Using the following API -- https://dog.ceo/dog-api/breeds-list a route to retrieve breed data.

    Notes - no authentication required with this API
          - you may use any library for making the http requests (axios, fetch, etc..)
    
*/

//This route will allow a user to pass in a specific dog breed and retrieve the list of results
app.get("/breedImages/:breed", (req, res) => {
  axios
    .get("https://dog.ceo/dog-api/breeds-list")
    .then(function(response) {
      // handle success
      console.log(response.data);
      res.send(response.data);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
      res.send(error);
    });
});

/*

    Activity 3

    Assume you need to look up a user from a database and it may take a few seconds to complete.
    You have another function that will then look up that users permissions after getting the user information.

    Convert the userLookup and getUserPermission functions into a promise chain or use async/await to make sure the userPermissions are not called before a user is returned

*/
//#03/31/2020#
//Using Promises:
app.get("/asyncTest", (req, res) => {
  const userLookup = userId => {
    return new Promise((resolve, reject) => {
      if (userId < 1) {
        reject("No user exist");
      }
      const getUserPermission = {
        userPermissions: "Yes",
        userId: "1234"
      };
      resolve(getUserPermission);
    });
  };
  userLookup(10)
    .then(userPerm => {
      res.send(userPerm);
      console.log("User Permissions are: ", userPerm);
    })
    .catch(err => console.log(err));
});

// app.get("/asyncTest", (req, res) => {
//   const userLookup = () => {
//     setTimeout(() => {
//       return "user1234";
//     }, 5000);
//   };

//   const getUserPermissions = user => {
//     console.log(`The user lookup returned => ${user}`);
//   };

//   userLookup();
//   getUserPermissions();
// });

/*

  Activity 4

  Suppose you have a URL that will be different between your TEST and PRODUCTION environments.
  How would you create an environment variable in node.js so that the url would not need to be hard coded?

*/

app.get("/envVar", (req, res) => {
  //set your env var here
  const myVar = process.env.ENV_VAR;
  res.send(configjson[process.env.ENV_VAR]);
  console.log(`my environment variable is ${myVar}`);
});
