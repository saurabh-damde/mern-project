const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return nxt(new HttpError(500, "Couldn't create user, please try again..."));
  }

  const user = new User({
    username,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await user.save();
  } catch (error) {
    return nxt(new HttpError(500, "Signing up Failed..."));
  }

  let token;
  try {
    token = jwt.sign({ id: user.id }, "privateKey-doNotShare-;)", {
      expiresIn: "1h",
    });
  } catch (err) {
    return nxt(new HttpError(500, "Signing up Failed..."));
  }

  res.status(201).json({ id: user.id, email: user.email, token: token });
};

const login = async (req, res, nxt) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return nxt(new HttpError(500, "Login Failed..."));
  }

  if (!user) {
    return nxt(new HttpError(403, "Invalid Credentials!"));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    return nxt(
      new HttpError(500, "Couldn't login, please check your credentials...")
    );
  }

  if (!isValidPassword) {
    return nxt(new HttpError(403, "Invalid Credentials!"));
  }

  let token;
  try {
    token = jwt.sign({ id: user.id }, "privateKey-doNotShare-;)", {
      expiresIn: "1h",
    });
  } catch (err) {
    return nxt(new HttpError(500, "Logging in Failed..."));
  }

  res.status(200).json({ id: user.id, email: user.email, token: token });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
