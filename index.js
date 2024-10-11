const express = require("express")
const app = express()
const cors = require("cors")
const { imagesRoute } = require("./routes/images.routes")
const { connection } = require("./config/db")
// const userRouter = require("./routes/user.route")
const adminRouter = require("./routes/admin.routes")
const { adminlogger } = require("./middelwares/admin.logger")
const {videoRouter} = require("./routes/videos.routes.js")
const volenteerRouter = require("./routes/volentire.route")
const sendEmailRoutes = require("./routes/sendemail.routes")
const WebSocket = require("ws");
const Notifications = require("./models/notifications.modal.js")
const donarRouter = require("./routes/donar.js")
const aboutusRouter = require("./routes/aboutus.route.js")
require("dotenv").config()

 
app.use(cors())
app.use(express.json())
app.use(express.static('public'));
app.use("/admin", adminRouter)
// app.use("/users", userRouter)
app.use("/donar",donarRouter)
app.use("/volenteer", volenteerRouter)
app.use("/images", imagesRoute)
app.use("/videos", videoRouter)
app.use("/reset_password", sendEmailRoutes)
app.use("/aboutus",aboutusRouter)

const server = app.listen(process.env.PORT, async () => {
   try {
      await connection
      console.log("connected to mongodb")
   } catch (error) {
      console.log(error.message)
   }
   console.log("server is running")
})

const wss = new WebSocket.Server({server});
const clients = new Set();
wss.on('connection', function connection(ws) {
   clients.add(ws);

   // Handle incoming messages from the client
   ws.on("message", function incoming(message) {
     console.log("Received message from client:", message);
    const sendNotification = message.toString('utf8');
     // Broadcast the message to all connected clients except the sender
     broadcastMessage(sendNotification, ws);
   });
 
   // Handle client disconnection
   ws.on("close", function () {
     console.log("Client disconnected");
     // Remove client from the set of connected clients
     clients.delete(ws);
   });
});
function broadcastMessage(message, sender) {

   for (const client of clients) {
     if (client !== sender && client.readyState === WebSocket.OPEN) {
       client.send(message);
     }
   }
 }

const storeNotifications = async(message)=>{
  try{
    const data = new Notifications(message)
  }
  catch(err){
console.log(err.message)
  }

}