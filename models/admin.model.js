const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    name: String,
    email: String,
    phone_number: String,
    password: String,
    year: String,
    image:String,
    address:String,
    gender:String,
})

const AdminModel = mongoose.model("admin", adminSchema)
module.exports = AdminModel