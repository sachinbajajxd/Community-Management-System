const mongoose = require('mongoose');


// Create a Mongoose schema
const roleSchema = new mongoose.Schema({
  id: {
    type: String,
    primary: true, // Indicate that this is the primary key
  },
  name: {
    type: String,
    maxlength: 64,
    unique: true, // Ensure each role name is unique
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

// Create the Role model using the schema
const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
