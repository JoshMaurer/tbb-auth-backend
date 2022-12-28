const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Type email here'],
    unique: [true, 'email already in use'],
  },

  //   password field
  password: {
    type: String,
    required: [true, 'Type password here'],
    unique: false,
  },
});

// export UserSchema
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);