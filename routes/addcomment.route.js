const express = require("express");
const Comment = require("../models/Comment");
const { chatGPT } = require("../middlewares/chatgptapi");
const router = express.Router();

// Add a comment (with moderation check)
router.post("/", async (req, res) => {
  const { userId, mediaId, text } = req.body;

  if (!userId || !mediaId || !text) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Prepare moderation prompt
  const moderationPrompt = `
    You are an AI moderator for a religious website. Your job is to analyze user comments and determine if they are appropriate for public display. A comment is deemed inappropriate if it contains:
    
    1. Abusive language, curse words, or slurs.
    2. Negative or hateful sentiments, especially targeting religion, culture, or individuals.
    3. Explicit or offensive content.
    4. Any language that is disrespectful, derogatory, or promotes violence.

    Your task:
    - If the comment is appropriate, respond with: "APPROVED".
    - If the comment is inappropriate, respond with: "REJECTED" and specify why it was rejected in a concise and polite way.

    Comment to analyze:
    "${text}"
  `;

  try {
    const moderationResponse = await chatGPT("system", moderationPrompt);

    // Check moderation result
    if (moderationResponse.includes("APPROVED")) {
      const newComment = new Comment({ user: userId, media: mediaId, text });
      await newComment.save();
      return res.status(201).json(newComment);
    } else {
      const rejectionReason = moderationResponse.replace("REJECTED:", "").trim();
      return res.status(400).json({ error: "Comment rejected", reason: rejectionReason });
    }
  } catch (err) {
    console.error("Moderation error:", err.message);
    return res.status(500).json({ error: "Failed to moderate comment" });
  }
});

// Get all comments for a media
router.get("/:mediaId", async (req, res) => {
  try {
    const comments = await Comment.find({ media: req.params.mediaId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    console.error("Fetch comments error:", err.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

module.exports = router;


// Update a comment
router.put("/:id", async (req, res) => {
  const { text } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true }
    );
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment
router.delete("/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
