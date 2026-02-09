import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken"

export const Signup = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;
    
        const userExits = await User.findOne({email: email})
        if(userExits) {
            return res.json({message: "User already exits"})
        }
    
        const newUser = await User.create({
            username,
            email,
            password,
            role
        })
    
        const token = jwt.sign({_id: newUser?._id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })
    
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 1 * 24 * 60 * 60 * 1000
        })
    
        return res
        .status(201)
        .json({success: true, message: "User created successfully", data: newUser})
    } catch (error) {
        res.status(500).json({success: false, Err: error.message})
    }
}

export const Signin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            throw new Error("Email & Password is required.")
        }

        const findUser = await User.findOne({email})
        if(!findUser) {
           throw new Error("Incorrect username or password")
        }

        const verifyPassword = await findUser.comparePassword(password)

        if (!verifyPassword) {
            throw new Error("Incorrect username or password")
        }

         const token = jwt.sign({_id: findUser?._id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })
    
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 1 * 24 * 60 * 60 * 1000
        })

        const user = await User.findById(findUser?._id).select("-password")

        return res.status(200).json({message: "SignIn Success", data: user})

    } catch (error) {
        res.json({Err: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        })

        return res.status(200).json({message: "Logout Success"})
    } catch (error) {
        return res.status(500).json({Err: error})
    }
}

export const GoogleSignUp = async (oauthUser) => {
    try {
        const {email, provider, providerId, username} = oauthUser;
    
        let user = await User.findOne({
            [`providers.${provider}`]: providerId   
        })
    
        if (user) return user
    
        user = await User.findOne({email})
    
        if(user) {
            user.providers[provider] = providerId
            await user.save()
            return user
        }
    
        user = await User.create({
            email, 
            username,
            providers: {
                [provider]: providerId
            }
        })
    
        return user

    } catch (error) {
        return error
    } 
}
