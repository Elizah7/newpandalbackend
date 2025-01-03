const mongoose = require("mongoose")



const videoShema = mongoose.Schema({
    videourl: {type:String, required:true},
    adminId: {type:String, required:true},
    year: {type:String, required:true},
    createdAt: { type: Date, default: Date.now },
})


const videoModel = mongoose.model("videos", videoShema)

module.exports = {
    videoModel
}