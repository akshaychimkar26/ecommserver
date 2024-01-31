const Product = require("../models/Product")

const CreateProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body)
        const savedProduct = await newProduct.save()
        res.status(201).json(savedProduct)
    }
    catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const GetallProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const SingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            })
        }
        res.json(product)
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const UpdateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedProduct) {
            return res.status(400).json({
                error: "Product not found"
            })
        }

        res.json(updatedProduct)
    }
    catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const DeleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id)
        if (!deletedProduct) {
            return res.status(404).json({
                error: "Product not found"
            })
        }

        res.json(deletedProduct)
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const search = async (req, res) => {
    const query = req.query.query;

    try {
        // Use Mongoose to search for data in MongoDB
        const searchResults = await Product.find({
            name: { $regex: new RegExp(query, 'i') }, // Case-insensitive search
        });

        res.json(searchResults);
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = { CreateProduct, SingleProduct, GetallProducts, UpdateProduct, DeleteProduct, search }