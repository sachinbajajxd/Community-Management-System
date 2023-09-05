const mongoose = require('mongoose');
const User=require('./User');


// Create a Mongoose schema
const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    primary: true, // Indicate that this is the primary key
  },
  name: {
    type: String,
    maxlength: 128,
  },
  slug: {
    type: String,
    unique: true, // Ensure each slug is unique
    maxlength: 255,
  },
  owner: {
    type: String,
    ref: User, // Reference the User model
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the Community model using the schema
const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
