
const mongoose = require("mongoose")

const imageShema = mongoose.Schema({
    image: String,
    userID: String,
    year: String,
    time:String
})


const imageModel = mongoose.model("images", imageShema)

module.exports = {
    imageModel
}