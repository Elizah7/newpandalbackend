const mongoose = require("mongoose")

const volenteersSchema = mongoose.Schema({
    name: String,
    phone_number: String,
    image:String,
    role:String,
    address:String,
})

const Volenteers  = mongoose.model("Volenteers", volenteersSchema)
module.exports = Volenteers