
const fs = require("fs")
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/admin.model");
const UserModel = require("../models/user.model");
const adminlogger = async (req, res, next) => {
       const method = req.method;
       const token = req.headers.authorization
       const decoded = jwt.verify(token, "pandal")
       if (decoded) {
              console.log("decoded", decoded)
              userID = decoded.userID
              const d = new Date();
              let time = d.getTime();
              const name = userdata.name
              const date = Date()
              try {
                     const userdata = await UserModel.findById(userID)
                     if (userdata.role == "admin") {
                            fs.appendFileSync("adminlogger.txt", `\nUserId : ${userId},User Name : ${name}, Method : ${method}and, Date : ${date}, Time:${time}`)
                     }
                     else if (userdata.role == "volenteer") {
                            fs.appendFileSync("volenteerlogger.txt", `\nUserId:${userId},User Name : ${name}, Method:${method}and, Date:${date}, Time:${time}`)
                     }
                     else if (userdata.role == "user") {
                            fs.appendFileSync("userlogger.txt", `\nUserId:${userId},User Name : ${name}, Method:${method}and, Date:${date}, Time:${time}`)
                     }


              } catch (error) {
                     res.send({ msg: error.message })
              }
       }
       next()
}

module.exports = { adminlogger }