const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    limit: { type: String },
    video: { type: String },
    imgTitle: { type: String },
    img: { type: String },
    imgLogo: { type: String },
    genre: { type: String },
    isSeries: { type: Boolean, default: "false" },
    year: { type: Date },
    trailer: { type: String },
    duration: { type: String },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("movie", MovieSchema);
