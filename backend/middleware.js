//auth middleware
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log('Connected to Tutorly DB')})
.catch((err) => {
    console.log(err);
});

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
