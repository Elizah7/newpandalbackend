const mongoose = require('mongoose');

const notificaionSchema = new mongoose.Schema({

  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
  adminId:{type:String,required:true}
});

const Notifications = mongoose.model('Notifications', notificaionSchema);
module.exports = Notifications;
