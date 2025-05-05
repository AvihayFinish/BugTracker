import mongoose from "mongoose";

const validateIdMongo = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
};

export default validateIdMongo;
// This code defines a middleware function `validateIdMongo` that checks if the ID provided in the request parameters is a valid MongoDB ObjectId.
// If the ID is invalid, it sends a 400 Bad Request response with an error message. 
// If the ID is valid, it calls the `next` function to proceed to the next middleware or route handler.