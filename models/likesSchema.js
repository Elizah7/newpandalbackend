const mongoose = require("mongoose")

export const likeSchema = mongoose.Schema({
    userID: { type: String, required: true },
    time: { type: Date, default: Date.now }
  });