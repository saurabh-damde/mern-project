const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, nxt) => {
  const id = req.params.id;
  let place;
  try {
    place = await Place.findById(id);
  } catch (err) {
    return nxt(
      new HttpError(500, "An issue occurred while retrieving the place...")
    );
  }
  if (!place) {
    return nxt(
      new HttpError(404, "Couldn't find a place for the provided id...")
    );
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, nxt) => {
  const id = req.params.id;
  let userPlaces;
  try {
    userPlaces = await User.findById(id).populate("places");
  } catch (error) {
    return nxt(
      new HttpError(500, "An issue occurred while retrieving the places...")
    );
  }
  if (!userPlaces || userPlaces.places.length === 0) {
    return nxt(
      new HttpError(404, "Couldn't find places for the provided user id...")
    );
  }
  res.json({
    places: userPlaces.places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return nxt(new HttpError(422, "Invalid data passed!"));
  }
  const { title, description, address, creator } = req.body;
  let location = {};
  try {
    location = await getCoordsForAddress(address);
  } catch (err) {
    return nxt(err);
  }
  const place = new Place({
    title,
    description,
    address,
    location,
    image:
      "https://cdn.britannica.com/73/114973-050-2DC46083/Midtown-Manhattan-Empire-State-Building-New-York.jpg",
    creator,
  });
  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return nxt(
      new HttpError(500, "An issue occurred while creating the place...")
    );
  }
  if (!user) {
    return nxt(new HttpError(500, "Couldn't find the creator..."));
  }
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.save({ session });
    user.places.push(place);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return nxt(
      new HttpError(500, "An issue occurred while creating the place...")
    );
  }
  res.status(201).json({ place });
};

const updatePlace = async (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return nxt(new HttpError(422, "Invalid data passed!"));
  }
  const id = req.params.id;
  const { title, description } = req.body;
  let place;
  try {
    place = await Place.findById(id);
    place.title = title;
    place.description = description;
    await place.save();
  } catch (err) {
    return nxt(
      new HttpError(500, "An issue occurred while updating the place...")
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, nxt) => {
  const id = req.params.id;
  try {
    const place = await Place.findById(id).populate("creator");
    if (!place) {
      return nxt(new HttpError(404, "Couldn't find the place..."));
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return nxt(
      new HttpError(500, "An issue occurred while deleting the place...")
    );
  }
  res.status(200).json({ message: "Place Deleted!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
