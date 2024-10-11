const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donar', required: true },  // Reference to the Donor
  amount: { type: Number, required: true },
  donationYear: { type: Number, required:true}, 
},{timestamps:true});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
