const mongoose = require("mongoose")

 const likeSchema = mongoose.Schema({
    userID: { type: String, required: true },
    time: { type: Date, default: Date.now }
  });

  module.export = {
    likeSchema
  }