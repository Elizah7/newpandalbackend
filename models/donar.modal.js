const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String }, 
  adminId:{type:String,required:true}
});

const Donar = mongoose.model('Donor', donorSchema);
module.exports = Donar;
