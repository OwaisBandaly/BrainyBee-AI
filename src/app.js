import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config"

const app = express()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

import userRoute from "./routes/User.route.js"

app.use("/api/user", userRoute)

export default app 