const express = require("express")
const nodemailer = require("nodemailer");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const sendEmailRoutes = express.Router();
const { google } = require("googleapis")
const { clientId, clientSecret, refreshToken, user } = require("../config/googleauth")

sendEmailRoutes.post("/", async (req, res) => {
    const OAuth2 = google.auth.OAuth2
    const OAuth2_Client = new OAuth2(clientId, clientSecret)
    OAuth2_Client.setCredentials({ refresh_token: refreshToken })

    const accessToken = await OAuth2_Client.getAccessToken()

    const transPorter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: user,
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            accessToken
        },
        secure: false
    })
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
                    from: user,
                    to: email,
                    text: `This link is valid for 10 minutes only http://localhost:3000/forgot_password/${singleuser._id}/${token}`
                }
                transPorter.sendMail(mailOption, (error, info) => {
                    if (error) {
                        console.log(error)
                        res.send({ msg: error })
                    }
                    else {
                        res.send({ msg: `Email has been sent`, data: info.messageId })
                    }
                })
            } catch (error) {
                console.log(error)
                res.send({ msg: error })
            }
        } else {

            res.send({ msg: `Email ${email} does not Exist. Try Registring` })
        }
    } catch (error) {
        console.log(error)
        res.send({ msg: error })
    }
})
sendEmailRoutes.get("/valid/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    console.log(id,token)
    try {
        const singleuser = await UserModel.findOne({ _id: id, verifytoken: token });
        const varifytoken = jwt.verify(token, "pandal")
        if (singleuser, varifytoken) {
            res.status(200).send({ msg: "user is valid", data: singleuser })
        } else {
            res.send({ msg: `Link is expired or user is not authenticated` })
        }
    } catch (error) {
        res.send({ msg: error })
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
                    res.send({ msg: "New User Added", data: updatedpassword })
                }
            })
        } else {
            res.send({ msg: `Link is expired or user is not authenticated` })
        }
    } catch (error) {
        res.send({ msg: error })
    }
})
module.exports = sendEmailRoutes