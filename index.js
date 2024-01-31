const express = require("express")
const app = express()
const mongoose = require("./db")
const dotenv = require('dotenv')
dotenv.config()
const route = require("./route")
app.use(express.json())
const cors = require("cors")
app.use(cors({
    origin: "*"
}))



app.use("/api", route)



app.listen(process.env.PORT, () => {
    console.log("hi 4400");
})