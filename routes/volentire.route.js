const express = require("express")
const cloudinary = require("cloudinary").v2
const upload = require("../middelwares/multer")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.model")
const { cloudUpload } = require("../config/Cloudinary.config")

require("dotenv").config()



const volenteerRouter = express.Router()
volenteerRouter.post("/register", async (req, res) => {
    const { name, phone_number, gender, password, email } = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
              return  res.send(`Registration Error: - ${err}`)
            } else {
                let ExistingUser = await UserModel.findOne({ email: email })
                if (ExistingUser) {
                  return  res.send({ msg: "User Already Exist, Try Login" })
                } else {
                    const newD = new Date()
                    const year = newD.getFullYear()
                    const image = "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    let newUser = new UserModel({ name, email, phone_number, password: hash, gender, year, image, role: "volenteer" })
                    await newUser.save();
                  return  res.send({ msg: "New User Added", user: newUser })
                }
            }
        })

    } catch (e) {
        console.log(e)
       return res.send(`Registration Error: - ${e}`)
    }
})
volenteerRouter.patch("/upload/:id", upload.single("image"), async (req, res) => {
    const id = req.params.id
    try {
        let ExistingUser = await UserModel.findById(id)
        if (ExistingUser) {
            const profileimage = await cloudUpload.uploader.upload(req.file.path)
            await UserModel.findByIdAndUpdate(id, { image: profileimage.url })
            let updated = await UserModel.findById(id)
          return  res.send({ msg: "profile image uploaded succesfully", updated })
        } else {
            res.send("User does not exists")
        }
    } catch (e) {
        console.log(e)
      return  res.send(`Registration Error: - ${e}`)
    }
})
volenteerRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        let User = await UserModel.find({ email: email })
        if (User.length > 0) {
            bcrypt.compare(password, User[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userID: User[0]._id }, "pandal");
                 return   res.send({ msg: `Login Success ! WelcomeBack ${User[0].name}`, token: token, user: User });
                } else {
                 return   res.send({ msg: "Wrong Password" })
                }
            })
        } else {
          return   res.send({ msg: `Email ${email} does not Exist. Try Registring` })
        }
    } catch (e) {
      return  res.send({ msg: "Error", reason: e })
    }
})

module.exports = volenteerRouter