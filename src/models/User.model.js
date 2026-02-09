import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: [true, "Username already taken"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true
    }
}, {timestamps: true})

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}


export const User = mongoose.model("User", userSchema) 