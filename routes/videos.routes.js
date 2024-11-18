// videosRoute.js
const express = require("express");
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const { videoModel } = require("../models/videos.models");
const multer = require("multer");
const config = require("../config/firebase");
const adminauth = require("../middelwares/adminauth");

const videoRouter = express.Router();

let storage = getStorage(initializeApp(config.firebaseConfig), process.env.BUCKETURL);

const upload = multer({ storage: multer.memoryStorage() });


videoRouter.post("/upload",adminauth, upload.single("video"), async (req, res) => {
//  const userID = req.query;
 console.log("video",req.body)
//  console.log("hihi")
 
const adminId = req.query

  try {
    const storageRef = ref(storage, `videos/${req.file.originalname}`);

    const metadata = {
      contentType: req.file.mimetype,
    };

    const snapShot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadUrl = await getDownloadURL(snapShot.ref);
    console.log(downloadUrl,"downurl")
    try {
      const d = new Date();
      const year = d.getFullYear();
      const savedVideo = new videoModel({ videourl: downloadUrl, year,adminId });
      await savedVideo.save();
     return res.status(200).send({ msg: "Video uploaded", data: savedVideo });
    } catch (error) {
     return res.send({ msg: "Error saving video URL to MongoDB", err: error.message });
    }
  } catch (error) {
   return res.send({ msg: "Error uploading video to Firebase", err: error.message });
  }
});

videoRouter.get("/", async (req, res) => {
  const { page = 1 } = req.query; // Default to page 1 if not provided
  const limit = 10;
  try {
    const data = await videoModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalVideos = await videoModel.countDocuments();
    const totalPages = Math.ceil(totalVideos / limit);

    res.status(200).send({
      msg: "Total videos",
      data,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages // Whether there are more pages to fetch
    });
  } catch (error) {
    res.status(500).send({ msg: "Error fetching videos", err: error.message });
  }
});

videoRouter.get("/:id", async (req, res) => {
  const {id} = req.params;
  try {
    const data = await videoModel.findById(id)
    res.status(200).send({
      msg: "Total videos",
      data,
    });
  } catch (error) {
    res.status(500).send({ msg: "Error fetching videos", err: error.message });
  }
});
// videoRouter.delete("/delete", (req, res) => {
//   // Add delete logic for videos if needed
// });

module.exports = {videoRouter};
