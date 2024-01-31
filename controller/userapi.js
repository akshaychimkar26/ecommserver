const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const uuid = require("uuid")
const stripe = require("stripe")("sk_test_51OaialSGPdT7h7vndRyWvGMp4pxrJy1nmr4rQ1KPwLP3tqeVPQRUppTQ2DpmkRdwS6ssfa41IgjrCaB0vJi2YSqc00GwH7OfP2")
dotenv.config()
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                error: "Email is already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name, email, password: hashedPassword })
        const savedUser = await newUser.save()
        const token = jwt.sign({ userId: savedUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" })
        res.status(201).json({ user: savedUser, token })
    }
    catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" })
        res.json({ user, token })
    }
    catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const Singleuser = async (req, res) => {

    // Endpoint to get details of a single user
    try {
        const userId = req.params.userId;

        // Use Mongoose to find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




const Payment = async (req, res) => {
    const { product, token } = req.body;
    const idempotencyKey = uuid.v4();

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        const charge = await stripe.charges.create(
            {
                amount: product.price * 100,
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: `Purchase of ${product.name}`,
            },
            { idempotencyKey }
        );

        res.status(200).json(charge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "payment failed" });
    }
}

module.exports = { signup, login, Singleuser, Payment }