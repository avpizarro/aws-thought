// Require the unique identifier package to be used to create an unique name for
// the uploaded file
const { v4: uuidv4 } = require('uuid');

const params = fileName => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];
  
    const imageParams = {
      Bucket: 'user-images-768480db-abc5-4aef-80cd-08e44b914c45',
      Key: `${uuidv4()}.${fileType}`,
      Body: fileName.buffer,
      ACL: 'public-read' // allow read access to this file
    };
  
    return imageParams;
  };

  module.exports = params;