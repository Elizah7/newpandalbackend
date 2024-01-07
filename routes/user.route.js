const express = require("express")
const cloudinary = require("cloudinary").v2
const upload = require("../middelwares/multer")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.model")
const auth = require("../middelwares/auth")
require("dotenv").config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


const userRouter = express.Router()

userRouter.get("/",auth, async (req, res) => {
    const { userID } = req.body
    console.log(req.body)
    
    try {
         const singleuser = await UserModel.findById(userID)
         if(singleuser){
            res.status(200).send({msg:"single user exists",data:singleuser})
         }
         else{
            res.status(404).send({msg:"user does not exists"})
         }
    } catch (error) {
        res.status(404).send({msg:error})
    }
})

userRouter.post("/register", async (req, res) => {
    const { name, phone_number, gender, password, email,role } = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.send(`Registration Error: - ${err}`)
            } else {
                let ExistingUser = await UserModel.findOne({ email: email })
                if (ExistingUser) {
                    res.send({ msg: "User Already Exist, Try Login" })
                } else {
                    const newD = new Date()
                    const year = newD.getFullYear()
                    const image = "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                    let newUser = new UserModel({ name, email, phone_number, password: hash, gender, year, image, role: "user" })
                    await newUser.save();
                    res.send({ msg: "New User Added", user: newUser })
                }
            }
        })

    } catch (e) {
        console.log(e)
        res.send(`Registration Error: - ${e}`)
    }
})
userRouter.patch("/upload/:id", upload.single("image"), async (req, res) => {
    const id = req.params.id
    try {
        let ExistingUser = await UserModel.findById(id)
        if (ExistingUser) {
            const profileimage = await cloudinary.uploader.upload(req.file.path)
            await UserModel.findByIdAndUpdate(id, { image: profileimage.url })
            let updated = await UserModel.findById(id)
            res.send({ msg: "profile image uploaded succesfully", updated })
        } else {
            res.send("User does not exists")
        }
    } catch (e) {
        console.log(e)
        res.send(`Registration Error: - ${e}`)
    }
})
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        let User = await UserModel.find({ email: email })
        if (User.length > 0) {
            bcrypt.compare(password, User[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userID: User[0]._id }, "pandal");
                    res.send({ msg: `Login Success ! WelcomeBack ${User[0].name}`, token: token, user: User });
                } else {
                    res.send({ msg: "Wrong Password" })
                }
            })
        } else {
            res.send({ msg: `Email ${email} does not Exist. Try Registring` })
        }
    } catch (e) {
        res.send({ msg: "Error", reason: e })
    }
})

module.exports = userRouter