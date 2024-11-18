const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  media: { type: Schema.Types.ObjectId, required: true }, // Media refers to image or video
  createdAt: { type: Date, default: Date.now }
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
