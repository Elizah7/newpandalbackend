

require("dotenv").config()


module.exports = {
    firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGINGSENDERID,
        appId: process.env.APPID
    }
}
  // Initialize Firebase
