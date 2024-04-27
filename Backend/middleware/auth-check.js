const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = authCheck = (req, res, nxt) => {
  if (req.method === "OPTIONS") {
    return nxt();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: "Bearer Token" => [Bearer, Token] => Token
    if (!token) {
      throw new Error("Authentication Failed!");
    }
    const decodedToken = jwt.verify(token, process.env.jwtKey);
    req.userData = { id: decodedToken.id };
    nxt();
  } catch (err) {
    return nxt(new HttpError(403, "Authentication Failed!"));
  }
};
