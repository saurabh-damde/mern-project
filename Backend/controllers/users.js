const { validationResult } = require("express-validator");
const uuid = require("uuid");
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    username: "Saurabh",
    email: "saurabh@email.com",
    password: "SaurabhD",
  },
  {
    id: "u2",
    username: "Rohit",
    email: "rohit@email.com",
    password: "RohitD",
  },
];

const getUsers = (req, res, nxt) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return nxt(new HttpError(422, "Invalid data passed!"));
  }
  const { username, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((user) => user.email === email);
  if (hasUser) {
    return nxt(
      new HttpError(422, "Couldn't create user, email ID already in use...")
    );
  }
  const user = {
    id: uuid.v4(),
    username,
    email,
    password,
  };
  DUMMY_USERS.push(user);
  res.status(201).json({ user });
};

const login = (req, res, nxt) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return nxt(new HttpError(401, "Invalid Credentials!"));
  }
  res.status(200).json({ message: "Logged In!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
