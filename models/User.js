const mongoose = require('mongoose');

// Define the Snowflake library for generating IDs
// const {Snowflake} = require('@theinternetfolks/snowflake');

// Create a Mongoose schema
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    primary: true, // Indicate that this is the primary key
  },
  name: {
    type: String,
    maxlength: 64,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    maxlength: 128,
  },
  password: {
    type: String,
    maxlength: 64,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
