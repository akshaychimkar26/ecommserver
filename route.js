const express = require("express")
const { signup, login, Singleuser, Payment } = require("./controller/userapi")
const { CreateProduct, SingleProduct, GetallProducts, UpdateProduct, DeleteProduct, search } = require("./controller/productapi")
const route = express.Router()

route.post("/signup", signup)
route.post("/login", login)
route.post("/createproduct", CreateProduct)
route.get("/singleproduct/:id", SingleProduct)
route.get("/getallproducts", GetallProducts)
route.put("/updateproduct/:id", UpdateProduct)
route.delete("/deleteproduct/:id", DeleteProduct)
route.get("/search", search)
route.get("/user/:userId", Singleuser)
route.post("/payment", Payment)


module.exports = route