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


videoRouter.post("/upload", upload.single("video"), async (req, res) => {
 const userID = req.query;
 console.log("video",req.body)
 console.log("hihi")
 


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
      const hour = d.getHours();
      const minute = d.getMinutes();
      const seconds = d.getSeconds();
      const time = hour + ":" + minute + ":" + seconds;
      const year = d.getFullYear();
      const savedVideo = new videoModel({ videourl: downloadUrl, year, time });
      await savedVideo.save();
      res.status(200).send({ msg: "Video uploaded", data: savedVideo });
    } catch (error) {
      res.send({ msg: "Error saving video URL to MongoDB", err: error.message });
    }
  } catch (error) {
    res.send({ msg: "Error uploading video to Firebase", err: error.message });
  }
});

videoRouter.get("/", async (req, res) => {
  try {
    const data = await videoModel.find();
    res.status(200).send({ msg: "Total videos", data: data });
  } catch (error) {
    res.send({ msg: "Error fetching videos from MongoDB", err: error.message });
  }
});

videoRouter.delete("/delete", (req, res) => {
  // Add delete logic for videos if needed
});

module.exports = {videoRouter};
