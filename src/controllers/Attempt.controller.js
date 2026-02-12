import mongoose from "mongoose";
import { Attempt } from "../models/Attempt.model.js";
import { Quiz } from "../models/Quiz.model.js";

export const answerQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Quiz ID",
      });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (!answers || !Array.isArray(answers)) {
      throw new Error("Answers must be provided as an array");
    }

    for (const answer of answers) {
      if (
        typeof answer.questionIndex !== "number" ||
        typeof answer.selectedAnswer !== "string"
      ) {
        throw new Error("Invalid answer format");
      }

      if (
        answer.questionIndex < 0 ||
        answer.questionIndex > quiz.questions.length
      ) {
        throw new Error("Invalid question index");
      }
      const question = quiz.questions[answer.questionIndex];

      if (!question.options.includes(answer.selectedAnswer)) {
        throw new Error("This answer option does not exists.");
      }
    }

    let score = 0;
    const evaluatedAnswers = [];

    for (const answer of answers) {
      const question = quiz.questions[answer.questionIndex];
      const correctAnswer = question.correctAnswer;

      const isCorrect = answer.selectedAnswer === correctAnswer;

      if (isCorrect) score++;

      evaluatedAnswers.push({
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      });

      const totalQuestions = quiz.questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      const attempt = await Attempt.create({
        quizId: quiz._id,
        userId: req.user._id,
        answers: evaluatedAnswers,
        score,
        percentage,
        totalQuestions,
      });

      return res.status(201).json({ message: "Quiz Attempted", data: attempt });
    }
  } catch (error) {
    return res.json({ Err: error.message });
  }
};

