const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, nxt) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return nxt(new HttpError(500, "Can't retrieve the users..."));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return nxt(new HttpError(422, "Invalid data passed!"));
  }
  const { username, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return nxt(new HttpError(500, "Signup Failed..."));
  }

  if (existingUser) {
    return nxt(422, "User already exist, please try logging in...");
  }
  const user = new User({
    username,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await user.save();
  } catch (error) {
    return nxt(new HttpError(500, "Signing up Failed..."));
  }

  res.status(201).json({ user: user.toObject({ getters: true }) });
};

const login = async (req, res, nxt) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return nxt(new HttpError(500, "Login Failed..."));
  }

  if (!user || user.password !== password) {
    return nxt(new HttpError(401, "Invalid Credentials!"));
  }

  res
    .status(200)
    .json({ message: "Logged In!", user: user.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
