import express from "express";
import {Signup, Signin, logout} from "../controllers/User.controller.js";

const router = express.Router();


router.post("/signup", Signup)
router.post("/signin", Signin)
router.post("/logout", logout)


export default router