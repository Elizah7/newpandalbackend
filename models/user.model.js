const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    phone_number: String,
    password: String,
    year: String,
    image:String,
    gender:String,
    role:String,
    address:String,
    verifytoken:String
})

const UserModel = mongoose.model("user", userSchema)
module.exports = UserModel