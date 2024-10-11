const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  welcomeNote: { type: String, required: true },
  villageInfo: { type: String, required: true },
  culturalActivities: { type: String, required: true },
  committeeEstablishment: { type: String, required: true },
  committeeDevelopment: { type: String, required: true },
  feelings: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  adminId : {type:String, required:true}
});

// Create a model from the schema
const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

module.exports = AboutUs;
