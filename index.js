const express = require("express")
const app = express()
const cors = require("cors")
const { imagesRoute } = require("./routes/images.routes")
const { connection } = require("./config/db")
const userRouter = require("./routes/user.route")
const adminRouter = require("./routes/admin.routes")
const { adminlogger } = require("./middelwares/admin.logger")
const {videoRouter} = require("./routes/videos.routes.js")
const volenteerRouter = require("./routes/volentire.route")
const sendEmailRoutes = require("./routes/sendemail.routes")
require("dotenv").config()
app.use(cors())
app.use(express.json())

app.use("/admin", adminRouter)
app.use("/users", userRouter)
app.use("/volenteer", volenteerRouter)
app.use("/images", imagesRoute)
app.use("/videos", videoRouter)
app.use("/reset_password", sendEmailRoutes)


app.listen(process.env.PORT, async () => {
   try {
      await connection
      console.log("connected to mongodb")
   } catch (error) {
      console.log(error.message)
   }
   console.log("server is running")
})

