const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");


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
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: 8,
      select: false, 
    },
    passwordConfirm: {
      type: String,
      required: [true, "A user must confirm the password"],
      select: false,
      validate: {
       
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    versionKey: false,
    timestamps: true, 
  }
);
UserSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();

 
  this.password = await bcrypt.hash(this.password, 12);

 
  this.passwordConfirm = undefined;
  next();
});
UserSchema.pre(/^find/, function (next) {
 
  this.find({ active: { $ne: false } });
  next();
});
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.createPasswordResetToken = function () {
 
  const resetToken = crypto.randomBytes(32).toString("hex");

  
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

 
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; 

  return resetToken;
};
module.exports = mongoose.model("User", UserSchema);
