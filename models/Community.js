const mongoose = require('mongoose');

// Define the Snowflake library for generating IDs
const Snowflake = require('@theinternetfolks/snowflake'); // Replace with the actual library

// Create a Mongoose schema
const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => Snowflake.generate(), // Generate Snowflake ID as the default value
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
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
