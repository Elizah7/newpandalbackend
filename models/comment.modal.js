const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: Schema.Types.ObjectId, required: true }, // Media refers to image or video
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Comment = mongoose.model('Comment', commentSchema);
  module.exports = Comment;
  