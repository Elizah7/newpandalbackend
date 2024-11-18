
const express = require("express");
const { initializeApp } = require("firebase/app")
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage")
const { imageModel } = require("../models/images.models");
const multer = require("multer")
const config = require("../config/firebase")
const path = require("path");
const auth = require("../middelwares/auth");
const { adminlogger } = require("../middelwares/admin.logger");
const adminauth = require("../middelwares/adminauth");
const app = express(express())
app.use(express.json())
require("dotenv").config()

let storage = getStorage(initializeApp(config.firebaseConfig), process.env.BUCKETURL)

const upload = multer({ storage: multer.memoryStorage() })
const imagesRoute = express.Router()
imagesRoute.post("/upload", adminauth, upload.single("image"), async (req, res) => {

    const userID = req.query

    try {
        const storageRef = ref(storage, `files/${req.file.originalname}`)
        const metadata = {
            contentType: req.file.mimetype
        }

        const snapShot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)
        const downloadUrl = await getDownloadURL(snapShot.ref)

        try {
            const d = new Date();
            const year = d.getFullYear()
            const savedImg = new imageModel({ image: downloadUrl, year: year, userID })
            await savedImg.save()
            res.status(200).send({ msg: "Image uploaded", data: savedImg })
        } catch (error) {
           return res.send({ msg: "msg", err: error.message })
        }
    } catch (error) {
      return  res.send({ msg: "msg", err: error.message })
    }
})


imagesRoute.post('/images/:id/like', async (req, res) => {
    try {
      const imageId = req.params.id;
      const { userID } = req.body;
  
      const image = await imageModel.findById(imageId);
      if (!image) {
        return res.status(404).send({ message: 'Image not found' });
      }
  
      // Check if the user has already liked the image
      const likeIndex = image.likes.findIndex(like => like.userID === userID);
      if (likeIndex === -1) {
        // If not liked, add a like
        image.likes.push({ userID });
      } else {
        // If already liked, remove the like
        image.likes.splice(likeIndex, 1);
      }
  
      await image.save();
  
     return res.send({ message: 'Image like status updated', image });
    } catch (error) {
    return  res.status(500).send({ message: 'Server error', error });
    }
  });
  
  imagesRoute.get("/", async (req, res) => {
    const { page } = req.query; 
    
    const limit = 10;
    console.log(page)
    try {
      const data = await imageModel
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit) // Skip the images from previous pages
        .limit(Number(limit)); // Limit the number of images per request
  
      const totalImages = await imageModel.countDocuments(); // Get the total count of images
  
      res.status(200).send({
        msg: "Total images",
        data: data,
        currentPage: page,
        totalPages: Math.ceil(totalImages / limit), // Calculate total pages
      });
      // console.log(data)
    } catch (error) {
     return res.status(500).send({ msg: "An error occurred", err: error.message });
    }
  });
  
  imagesRoute.get("/:id", async (req, res) => {
    const { id } = req.params; 
    console.log(id,"iii")
    try {
      const data = await imageModel.findById(id);
      console.log(data)
      res.status(200).send({
        msg: "Image found successfully",
        data: data,
      });
    } catch (error) {
     return res.status(500).send({ msg: "An error occurred", err: error.message });
    }
  });

module.exports = {
    imagesRoute
}