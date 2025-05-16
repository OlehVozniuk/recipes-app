const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRATION,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRATION,
      }
    );

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password!",
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    // 3) If everything ok, send token to client
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRATION,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRATION,
      }
    );

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
