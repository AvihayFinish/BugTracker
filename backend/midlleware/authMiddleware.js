import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            console.log(req.user);
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { protect };
// This code defines a middleware function called `protect` that checks if a user is authenticated by verifying a JWT token stored in cookies. 
// If the token is valid, it retrieves the user's information from the database and attaches it to the request object. 
// If the token is invalid or not present, it sends a 401 Unauthorized response.