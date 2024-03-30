const express = require("express");
const bodyParser = require("body-parser");

const HttpError = require("./models/http-error");
const places = require("./routes/places");
const users = require("./routes/users");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", places);
app.use("/api/users", users);

app.use((req, res, nxt) => {
  nxt(new HttpError(404, "Couldn't find the specified route..."));
});

app.use((err, req, res, nxt) => {
  if (res.headerSent) {
    return nxt(err);
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "An unknown error occurred!" });
});

app.listen(5000);
