const mongoose = require("mongoose")
const likeSchema = require("./likesSchema")



const videoShema = mongoose.Schema({
    videourl: {type:String, required:true},
    userID: {type:String, required:true},
    year: {type:String, required:true},
    time:{type:String, required:true},
    likes: [likeSchema]
})


const videoModel = mongoose.model("videos", videoShema)

module.exports = {
    videoModel
}