import mongoose, {Schema} from "mongoose";

const answerSchema = new Schema({
    questionIndex: {
        type: Number,
        required: true
    },
    selectedAnswer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean
    }
}, {_id: false})



const attemptSchema = new Schema({
    quizId: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: {
        type: [answerSchema],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number
    },
    totalQuestions: {
      type: Number,
      required: true
    },

}, {timestamps: true})


export const Attempt = mongoose.model("Attempt", attemptSchema)