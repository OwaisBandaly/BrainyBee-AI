import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"

export const authMiddleware = async(req, res, next) => {
    try {
        console.log("Cookies:", req.cookies);
        console.log("Auth header:", req.headers.authorization);

        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    
        if (!token) {
            return res.status(401).json({message: "Unauthorized"})
        }
    
        const user = jwt.verify(token, process.env.JWT_SECRET)
        if(!user) {
             return res
            .status(404)
            .json({ success: false, message: "Unauthorized - Invalid token." });
        }
    
        const findUser = await User.findById(user._id).select("-password")
    
        if (!findUser)
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized - User not found." });
            
        req.user = findUser; 
        next();
    } catch (error) {
        return res
      .status(500)
      .json({ success: false, message: "something went wrong." });
  }
    }