var jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const adminauth = async (req, res, next) => {

    const token = req.headers.authorization;
    console.log("token",token)
    if (token) {
        const decoded = await jwt.verify(token, "pandal");
        if (decoded) {
            const userId = decoded.userId;
            try {
                let ExistingUser = await UserModel.findById(userId)
                if (ExistingUser.role == "admin") {
                    console.log("useridauth",userId)
                    req.query = userId;
                    next();
                } else {
                    res.send("User does not exists")
                }
            } catch (e) {
                console.log(e)
                res.send(`Registration Error: - ${e}`)
            }

        } else {
            res.send({ msg: "please login" });
        }
    } else {
        res.send({ msg: "please login" });
    }
};

module.exports = adminauth
