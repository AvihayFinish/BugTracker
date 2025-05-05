import express from "express";
import { userRegister, 
        userLogin, 
        userLogout, 
        getProfile, 
        updateProfile } from "../controllers/userController.js";
import { protect } from "../midlleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);

userRouter.post("/login", userLogin);

userRouter.post("/logout", userLogout);

userRouter.route("/profile").get(protect, getProfile).put(protect, updateProfile);

export default userRouter;