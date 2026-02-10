import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken"
import {Signup, Signin, logout, GoogleSignUp, setPassword, myInfo} from "../controllers/User.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/signup", Signup)
router.post("/signin", Signin)
router.post("/logout", logout)

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}))
router.get("/google/login", passport.authenticate("google", {session: false}), async (req, res) => {
    const user = await GoogleSignUp(req.user)
    const token = jwt.sign({_id: user?._id}, process.env.JWT_SECRET, {expiresIn: "1d"})

    res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000
        })

    res.send({success: true, data: user})
})

router.patch("/setpassword", authMiddleware, setPassword)
router.get("/myinfo", authMiddleware, myInfo)

export default router