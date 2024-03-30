const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = ""; // Key to the google GeoCoding API

const getCoordsForAddress = async (address) => {
  // Code for retrieving coordinates using google's API
  //   const response = await axios.get(
  //     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
  //       address
  //     )}&key=${API_KEY}`
  //   );
  //   const data = response.data;
  //   if (!data || data.status === "ZERO_RESULTS") {
  //     throw new HttpError(
  //       420,
  //       "Couldn't find location for the specified address..."
  //     );
  //   }
  //   const coords = data.results[0].geometry.location;
  //   return coords;

  return {
    lat: 135.79,
    lng: 246.8,
  };
};

module.exports = getCoordsForAddress;
