const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const Donation = require("../models/Donations.modal");
const Donar = require("../models/donar.modal");
const multer = require("multer");
const adminauth = require("../middelwares/adminauth");
require("dotenv").config();

const donarRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

donarRouter.post("/donation",adminauth, upload.single("image"), async (req, res) => {
    // console.log("donation");
    const { name, address, amount } = req.body;
    const adminId = req.query
    // console.log(req.file);  // Logging file details for debugging
    // console.log(name, amount, address);

    try {
        // Upload image buffer to Cloudinary
        const profileimage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
       
                (error, result) => {
                    if (result) {
                        resolve(result.secure_url);  // Get the uploaded image URL
                    } else {
                        reject(error);
                    }
                }
            );
            stream.end(req.file.buffer);  // Upload file from buffer
        });

        const newD = new Date();
        const year = newD.getFullYear();
        console.log(year)
        const img = profileimage || "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png";
        console.log(img,"ig")
        // Create the new donor with the image URL
        let newUser = new Donar({ name, address, image: img,adminId });
        await newUser.save();

        // Create the donation record
        let donation = new Donation({ donor: newUser._id, amount, donationYear: year ,createdAt:year});
        await donation.save();

       return res.send({ msg: "Donation added successfully", img });
    } catch (e) {
        console.log(e);
        return res.status(500).send({meg: e.message});
    }
});



// Donor
donarRouter.get("/singledonar/:id" ,async (req, res) => {
    const id  = req.params.id
    console.log(req.body)

    try {
        const singleuser = await Donar.findById(id)
        if (singleuser) {
           return res.status(200).send({data: singleuser })
        }
        else {
          return res.status(404).send({ msg: "Donar does not exists" })
        }
    } catch (error) {
       return res.status(404).send({ msg: error })
    }
})
donarRouter.get("/", async (req, res) => {

    try {
        const donars = await Donar.find().sort({ amount: 1 })
        if (donars.length>0) {
           return res.status(200).send({msg:"Donar's data", data:donars})
        }
        else {
           return res.status(404).send({ msg: "Donar does not exists",data:[] })
        }
    } catch (error) {
       return res.status(404).send({ msg: error })
        // console.log(error)
    }
})

donarRouter.get("/donations", async (req, res) => {
  console.log("Fetching donations");

  try {
    // Fetch all donors
    const donars = await Donar.find();

    if (donars.length > 0) {
      // For each donor, find their associated donations
      const donarsWithDonations = await Promise.all(
        donars.map(async (donar) => {
          try {
            // Find donations for each donor based on donor's ObjectId
            const donations = await Donation.find({ donor: donar._id }).sort({ amount: 1 });
            return {
              ...donar._doc, // Use _doc to get the plain object representation of the Mongoose document
              donations,
            };
          } catch (err) {
            // In case of an error fetching donations, handle it gracefully
            return {
              ...donar._doc,
              donations: [],
              error: "Error fetching donations for this donor",
            };
          }
        })
      );
      const totaldonation = donarsWithDonations.reduce((total, donar) => {
        const donorTotal = donar.donations.reduce((sum, donation) => sum + donation.amount, 0);
        return total + donorTotal;
      }, 0);
      // Return the donors with their associated donations
      return res.status(200).send({ msg: "Donors with donations fetched successfully", data: donarsWithDonations,totaldonation });
    } else {
      // If no donors found
      return res.status(404).send({ msg: "No donors found", data: [] });
    }
  } catch (error) {
    // General error handling for the API call
    return res.status(500).send({ msg: "Error fetching donors", error: error.message });
  }
});

  


donarRouter.post("/donation/:id",async (req, res) => {
    const {amount } = req.body
    const id = req.params.id
    try {
        let ExistingUser = await Donar.findById(id)
        if (ExistingUser) {
            const newD = new Date()
            const year = newD.getFullYear() 
            let donation = new Donation({donor:ExistingUser._id,amount,donationYear:year})
            donation.save()
          return  res.send({ msg: "Donation added succesfully" })
        } else {
           return res.send({message:"Donar does not exists"})
        }
    }
    catch (e) {
        console.log(e)
    }
})
// donarRouter.post("/login", async (req, res) => {
//     const { email, password } = req.body
//     console.log(req.body)
//     try {
//         let User = await Donar.find({ email: email })
//         if (User.length > 0) {
//             bcrypt.compare(password, User[0].password, (err, result) => {
//                 if (result) {
//                     let token = jwt.sign({ userID: User[0]._id }, "pandal");
//                     res.send({ msg: `Login Success ! WelcomeBack ${User[0].name}`, token: token, user: User });

//                 } else {
//                     res.send({ msg: "Wrong Password" })
//                 }
//             })
//         } else {
//             res.send({ msg: `Email ${email} does not Exist. Try Registring` })
//         }
//     } catch (e) {
//         res.send({ msg: "Error", reason: e })
//     }
// })

module.exports = donarRouter