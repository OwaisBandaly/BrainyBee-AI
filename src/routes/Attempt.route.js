import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { answerQuiz } from "../controllers/Attempt.controller.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/:id", answerQuiz)


export default router