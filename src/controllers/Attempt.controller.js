import mongoose from "mongoose";
import { Attempt } from "../models/Attempt.model.js";
import { Quiz } from "../models/Quiz.model.js";

export const answerQuiz = async (req, res) => {
  try {
      const userid = req.user._id
      const { quizid } = req.params;
      const {answer} = req.body

    if (!mongoose.isValidObjectId(quizid)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Quiz ID",
      });

      

    }
  } catch (error) {}
};
