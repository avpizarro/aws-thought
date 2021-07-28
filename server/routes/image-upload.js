const express = require("express");
const router = express.Router();
// Require multer to have a middleware that temporary stores the files unitl they are ready for upload to S3
const multer = require("multer");
const AWS = require("aws-sdk");

// Require the function that sets the parameters neede to upload the image to S3
const paramsConfig = require('../utils/params-config');

// Define the storage destination
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

// Declare the upload object, which has a storage destination and a key
// image is the key!
const upload = multer({storage}).single('image');

// Instanciate the service object s3 to communicate with the S3 web service so 
// we can upload the image
const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
  })


// Create the upload route
router.post('/image-upload', upload, (req, res) => {
     // set up params config
    const params = paramsConfig(req.file);
    // set up S3 service call
    s3.upload(params, (err, data) => {
        if(err) {
          console.log(err); 
          res.status(500).send(err);
        }
        res.json(data);
      });
  });

  module.exports = router;