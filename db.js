const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, UseUnifiedTopology: true })

const db = mongoose.connection

db.on("connected", () => {
    console.log("connected to mongodb");
})

db.on("error", (err) => {
    console.log("error connecting to mongodb", err);
})

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.log("mongoose disconnected through app termination");
        process.exit(0)
    })
})

module.exports = mongoose