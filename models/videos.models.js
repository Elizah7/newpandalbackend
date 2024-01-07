

const mongoose = require("mongoose")

const videoShema = mongoose.Schema({
    videourl: String,
    // userID: String,
    year: String,
    time:String
})


const videoModel = mongoose.model("videos", videoShema)

module.exports = {
    videoModel
}