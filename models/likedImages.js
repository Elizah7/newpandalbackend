
const mongoose = require("mongoose")

const likedimagesShema = mongoose.Schema({
    imageId: String,
    usersArray: Array,
    year: String,
    time:String,
})


const imageModel = mongoose.model("images", imageShema)

module.exports = {
    imageModel
}