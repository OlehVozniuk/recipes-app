const mongoose = require("mongoose");
const validator = require("validator");
//name, email, photo, password, passwordConfirm
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: 8,
      select: false, // Exclude password from query results
    },
    passwordConfirm: {
      type: String,
      required: [true, "A user must confirm the password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", UserSchema);
