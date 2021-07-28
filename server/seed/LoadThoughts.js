// Require aws-sdk package to create the interface with DynamoDB
// and fs(file system) package to read the users.json file
const AWS = require("aws-sdk");
const fs = require("fs");

// Modify the AWS object that Dynamo.DB will use to connect to the local instance
AWS.config.update({
   region: "us-east-2",
  endpoint: "http://localhost:8000",
});

// Use the DocumentClient() class to create a dynamodb service object
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

// Read users.json file and assign object to the allUsers constant
console.log("Importing thoughts into DynamoDB. Please wait.");
const allUsers = JSON.parse(
  fs.readFileSync("./server/seed/users.json", "utf8")
);

// Loop through the allUsers array and create the params object
allUsers.forEach((user) => {
  const params = {
    TableName: "Thoughts",
    Item: {
      username: user.username,
      createdAt: user.createdAt,
      thought: user.thought,
    },
  };
//   Add the params to the table using the PUT method
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", user.username);
    }
});
});
