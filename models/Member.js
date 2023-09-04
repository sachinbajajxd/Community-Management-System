const mongoose = require('mongoose');

// Create a Mongoose schema
const memberSchema = new mongoose.Schema({
  id: {
    type: String,
    primary: true, // Indicate that this is the primary key
  },
  community: {
    type: String,
    ref: 'Community', // Reference the Community model by its ID
  },
  user: {
    type: String,
    ref: 'User', // Reference the User model by its ID field
  },
  role: {
    type: String,
    ref: 'Role', // Reference the Role model by its ID
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create the Member model using the schema
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
