import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createQuiz, viewQuiz } from "../controllers/Quiz.controller.js";

const router = express.Router();

router.use(authMiddleware)

router.post("/createquiz", createQuiz)
router.get("/view/:id", viewQuiz)


export default router