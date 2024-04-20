const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const HttpError = require("./models/http-error");
const places = require("./routes/places");
const users = require("./routes/users");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, nxt) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  nxt();
});

app.use("/api/places", places);
app.use("/api/users", users);

app.use((req, res, nxt) => {
  nxt(new HttpError(404, "Couldn't find the specified route..."));
});

app.use((err, req, res, nxt) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return nxt(err);
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://saurabh:Saurabh.3@mazino.wm8ui5a.mongodb.net/mern?retryWrites=true&w=majority&appName=mazino"
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
