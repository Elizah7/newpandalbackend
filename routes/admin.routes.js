const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const AdminModel = require("../models/admin.model")
const UserModel = require("../models/user.model")
// const upload = require("../middelwares/multer")
const adminauth = require("../middelwares/adminauth")
const cloudinary = require("cloudinary").v2
const multer = require("multer")
const adminRouter = express.Router()
require("dotenv").config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() })
adminRouter.get("/", adminauth, async (req, res) => {

    try {
        const singleuser = await UserModel.findById({ _id: req.query })
        console.log(singleuser)
        if (singleuser) {
            return res.status(200).send({ msg: "single user exists", data: singleuser })
        }
        else {
            return res.status(404).send({ msg: "user does not exists" })
        }
    } catch (error) {
        return res.status(404).send({ msg: error })
    }
})

adminRouter.post("/register", async (req, res) => {
    const { name, email, phone_number, password } = req.body
    console.log(req.body)
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log(err)
            } else {
                let ExistingUser = await UserModel.findOne({ email: email })
                if (ExistingUser) {
                    return res.send({ msg: "User Already Exist, Try Login" })
                } else {
                    const newD = new Date()
                    const year = newD.getFullYear()
                    const image = "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    let newUser = new UserModel({ name, email, phone_number, password: hash, image, year, role: "admin" })
                    await newUser.save();
                   return res.send({ msg: "New User Added", user: newUser })
                }
            }
        })
    } catch (e) {
        console.log(e)
        res.send(`Registration Error: - ${e}`)
    }
})
adminRouter.patch("/upload/:id", upload.single("image"), async (req, res) => {
    const _id = req.params.id
    console.log("req", req.file)
    try {
        let ExistingUser = await UserModel.findById(_id)
        console.log(ExistingUser)
        if (ExistingUser) {
            const profileimage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
           
                    (error, result) => {
                        if (result) {
                            resolve(result.secure_url);  // Get the uploaded image URL
                        } else {
                            reject(error);
                        }
                    }
                );
                stream.end(req.file.buffer);  // Upload file from buffer
            });
            await UserModel.findByIdAndUpdate(_id, { image: profileimage})
            let updated = await UserModel.findById(_id)
          return  res.send({ msg: "profile image uploaded succesfully", updated })
        } else {
            res.send("User does not exists")
        }
    } catch (e) {
        console.log(e)
       return res.send(`Registration Error: - ${e}`)
    }
})
adminRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        let User = await UserModel.find({ email: email })

        if (User.length > 0) {
            bcrypt.compare(password, User[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userId: User[0]._id }, "pandal");
                    res.send({ msg: `Login Success ! WelcomeBack ${User[0].name}`, token: token });
                } else {
                    res.send({ msg: "Wrong Password" })
                }
            })
        } else {
         return   res.send({ msg: `Email ${email} does not Exist. Try Registring` })
        }
    } catch (e) {
      return  res.send({ msg: "Error", reason: e })
    }
})

module.exports = adminRouter