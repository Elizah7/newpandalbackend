const express = require("express")
const nodemailer = require("nodemailer");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const sendEmailRoutes = express.Router();


sendEmailRoutes.post("/", async (req, res) => {
    let transPorter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'uddeshkrrish@gmail.com',
            pass: 'cfby oyec abgu nfpo'
        }
    });
    const { email } = req.body;
    console.log(email)
    try {
        const singleuser = await UserModel.findOne({ email });
        console.log(singleuser)
        if (singleuser) {
            let token = jwt.sign({ userId: singleuser._id }, "pandal", {
                expiresIn: "600s"
            });
            try {
                const updateduser = await UserModel.findByIdAndUpdate(singleuser._id, { verifytoken: token })
                const mailOption = {
                    from: "uddeshkrrish@gmail.com",
                    to: email,
                    text: `This link is valid for 10 minutes only http://localhost:3000/forgot_password/${singleuser._id}/${token}`
                }
                transPorter.sendMail(mailOption, (error, info) => {
                    if (error) {
                        console.log(error)
                      return  res.send({ msg: error })
                    }
                    else {
                     return   res.send({ msg: `Email has been sent`, data: info.messageId })
                    }
                })
            } catch (error) {
                console.log(error)
               return res.send({ msg: error })
            }
        } else {

         return   res.send({ msg: `Email ${email} does not Exist. Try Registring` })
        }
    } catch (error) {
        console.log(error)
     return   res.send({ msg: error })
    }
})
sendEmailRoutes.get("/valid/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    console.log(id,token)
    try {
        const singleuser = await UserModel.findOne({ _id: id, verifytoken: token });
        const varifytoken = jwt.verify(token, "pandal")
        if (singleuser, varifytoken) {
           return res.status(200).send({ msg: "user is valid", data: singleuser })
        } else {
         return   res.send({ msg: `Link is expired or user is not authenticated` })
        }
    } catch (error) {
      return  res.send({ msg: error })
    }
})

sendEmailRoutes.post("/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body
    try {
        const singleuser = await UserModel.findOne({ _id: id, verifytoken: token });
        const varifytoken = jwt.verify(token, "pandal")
        if (singleuser, varifytoken) {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.send(`Registration Error: - ${err}`)
                } else {
                    let updatedpassword = await UserModel.findByIdAndUpdate({ _id: id }, { password: password });
                  return  res.send({ msg: "New User Added", data: updatedpassword })
                }
            })
        } else {
          return  res.send({ msg: `Link is expired or user is not authenticated` })
        }
    } catch (error) {
      return  res.send({ msg: error })
    }
})
module.exports = sendEmailRoutes