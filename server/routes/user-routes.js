// Import express and use router to create the routes
const express = require("express");
const router = express.Router();
// Import aws-sdk
const AWS = require("aws-sdk");
// Define the config params for aws
const awsConfig = {
    region: "us-east-2"
};
// Configure the service interface object
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = "Thoughts";

// Create the routes

// Get route to get all the users thoughts
router.get("/users", (req, res) => {
  const params = {
    TableName: table,
  };
  // Scan return all items in the table
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json(err); // an error occurred
    } else {
      res.json(data.Items);
    }
  });
});

// Get all thoughts for a specific user
// Define the endpoint
router.get("/users/:username", (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}.`);
  // Define the search params and the response we need
  const params = {
    TableName: table,
    KeyConditionExpression: "#un = :user",
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought",
    },
    ExpressionAttributeValues: {
      ":user": req.params.username,
    },
    ProjectionExpression: "#th, #ca",
    ScanIndexForward: false,
  };

  // Query the table with the params defined above
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Query succeeded.");
      res.json(data.Items);
    }
  });
}); // closes the route for router.get(users/:username)

// Create new user at /api/users
router.post('/users', (req, res) => {
  const params = {
    TableName: table,
    Item: {
      "username": req.body.username,
      "createdAt": Date.now(),
      "thought": req.body.thought
    }
  };
  // database call
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.log('This is the date: ', Date.now());
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
          res.json({"Added": JSON.stringify(data, null, 2)});
        }
      });
    });  // ends the route for router.post('/users')

// Expose endpoints
module.exports = router;
