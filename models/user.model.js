const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    phone_number: String,
    password: String,
    year: String,
    image:String,
    role:String,
    verifytoken:String,
    createdAt: { type: Date, default: Date.now },
})

const UserModel = mongoose.model("user", userSchema)
module.exports = UserModel