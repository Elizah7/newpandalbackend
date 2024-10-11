const mongoose = require("mongoose");
const likeSchema = require("./likesSchema")

const imageSchema = mongoose.Schema({
  image: { type: String, required: true },
  userID: { type: String, required: true },
  year: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const imageModel = mongoose.model("Image", imageSchema);

module.exports = {
  imageModel
};
