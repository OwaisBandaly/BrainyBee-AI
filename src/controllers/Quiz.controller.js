import mongoose from "mongoose";
import { Quiz } from "../models/Quiz.model.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, topic, difficulty, questions, isPublic } = req.body;

    if (!title || !topic || !difficulty || !questions?.length) {
      throw new Error("Missing required fields.");
    }

    for (const que of questions) {
      if (
        !que.questionText ||
        !Array.isArray(que.options) ||
        que.options.length < 2 ||
        !que.correctAnswer
      ) {
        return res.status(400).json({ message: "Invalid question format." });
      }

      if (!que.options.includes(que.correctAnswer)) {
        return res
          .status(400)
          .json({ message: "Correct answer must be one of the options" });
      }
    }

    const quiz = await Quiz.create({
      title,
      topic,
      difficulty,
      questions,
      createdBy: req.user?._id,
      isPublic,
    });

    return res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    return res.json({ Err: error.message });
  }
};

export const viewQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Quiz ID",
      });
    }

    const quiz = await Quiz.findById(id).lean();

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (req.user._id.toString() === quiz?.createdBy.toString()) {
      return res.status(200).json({ data: quiz });
    }

    if (quiz.isPublic) {
      const safeQuiz = {
        _id: quiz._id,
        title: quiz.title,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        questions: quiz.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
        }))
      }
        return res.status(200).json({data: safeQuiz })
    } 

    return res
      .status(403)
      .json({ message: "You are not authorized to view this quiz" });
  } catch (error) {
    return res.json({ Err: error.message });
  }
};
