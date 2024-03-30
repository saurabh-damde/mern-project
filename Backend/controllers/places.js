const { validationResult } = require("express-validator");
const uuid = require("uuid");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484405,
      lng: -73.9905353,
    },
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u1",
  },
];

const getPlaceById = (req, res, nxt) => {
  const id = req.params.id;
  const place = DUMMY_PLACES.find((place) => place.id === id);
  if (!place) {
    return nxt(
      new HttpError(404, "Couldn't find a place for the provided id...")
    );
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, nxt) => {
  const id = req.params.id;
  const places = DUMMY_USERS.filter((place) => place.creator === id);
  if (!places || places.length === 0) {
    return nxt(
      new HttpError(404, "Couldn't find places for the provided user id...")
    );
  }
  res.json({ places });
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

  const place = {
    id: uuid.v4(),
    title,
    description,
    location,
    address,
    creator,
  };
  DUMMY_PLACES.push(place);
  res.status(201).json({ place });
};

const updatePlace = (req, res, nxt) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return nxt(new HttpError(422, "Invalid data passed!"));
  }
  const id = req.params.id;
  const { title, description } = req.body;
  const index = DUMMY_PLACES.findIndex((place) => place.id === id);
  const place = {
    ...DUMMY_PLACES.find((place) => place.id === id),
    title,
    description,
  };
  DUMMY_PLACES[index] = place;
  res.status(200).json({ place });
};

const deletePlace = (req, res, nxt) => {
  const id = req.params.id;
  if (!DUMMY_PLACES.find((place) => place.id === id)) {
    return nxt(new HttpError(404, "The place is not registered!"));
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== id);
  res.status(200).json({ message: "Place Deleted!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
