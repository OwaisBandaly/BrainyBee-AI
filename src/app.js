import "dotenv/config"
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.config.js"

const app = express()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize())

import userRoute from "./routes/User.route.js"
import quizRoute from "./routes/Quiz.route.js"

app.use("/api/user", userRoute)
app.use("/api/quiz", quizRoute)

export default app 