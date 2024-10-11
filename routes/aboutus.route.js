const express = require("express")
const jwt = require("jsonwebtoken")
const AdminModel = require("../models/admin.model")
const UserModel = require("../models/user.model")
const cloudinary = require("cloudinary").v2
const AboutUs = require("../models/aboutus.modal")
const adminauth = require("../middelwares/adminauth")
const aboutusRouter = express.Router()
require("dotenv").config()


aboutusRouter.get("/", async (req, res) => {

    try {
        const aboutus  = await AboutUs.find()
        // console.log(singleuser)
        if (aboutus) {
          return  res.status(200).send({ msg: "succesfull", data: aboutus })
        }
        else {
          return  res.status(404).send({ msg: "nothing about us" })
        }
    } catch (error) {
      return  res.status(404).send({ msg: error })
    }
})

aboutusRouter.post("/aboutusdata", async (req, res) => {
    const { title, welcomeNote, villageInfo, culturalActivities,committeeEstablishment,committeeDevelopment,contribution,feelings,createdAt } = req.body
    // console.log(req.body)
    const adminId = '6454da82d307f25d59a38157'

    try {
                    let aboutus = new AboutUs({ title, welcomeNote, villageInfo, culturalActivities,committeeEstablishment,committeeDevelopment,contribution,feelings,createdAt,adminId })
                    await aboutus.save();
                  return  res.send({ msg: "About us added", data: aboutus })
    } catch (e) {
        console.log(e)
       return res.send(`Error: - ${e}`)
    }
})
// aboutusRouter.patch("/upload/:id", upload.single("image"), async (req, res) => {
//     const _id = req.params.id
//     console.log("req", req.file)
//     try {
//         let ExistingUser = await UserModel.findById(_id)
//         console.log(ExistingUser)
//         if (ExistingUser) {
//             const profileimage = await new Promise((resolve, reject) => {
//                 const stream = cloudinary.uploader.upload_stream(
           
//                     (error, result) => {
//                         if (result) {
//                             resolve(result.secure_url);  // Get the uploaded image URL
//                         } else {
//                             reject(error);
//                         }
//                     }
//                 );
//                 stream.end(req.file.buffer);  // Upload file from buffer
//             });
//             await UserModel.findByIdAndUpdate(_id, { image: profileimage})
//             let updated = await UserModel.findById(_id)
//             res.send({ msg: "profile image uploaded succesfully", updated })
//         } else {
//             res.send("User does not exists")
//         }
//     } catch (e) {
//         console.log(e)
//         res.send(`Registration Error: - ${e}`)
//     }
// })


module.exports = aboutusRouter