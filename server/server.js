const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const userRoutes = require('./routes/user-routes');
const imageRoutes = require('./routes/image-upload'); // add this file import to the top of the file
console.log();


// express middleware, used to be bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// app.use(require('./routes'));
app.use('/api/', userRoutes);
app.use('/api/', imageRoutes); // add this route for image upload

// Start the API server
app.listen(PORT, () =>
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`)
);