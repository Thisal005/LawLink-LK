import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import genarateToken from "../utills/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, password, confirmPassword, email, contact } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const username = fullName.toLowerCase().replace(/\s+/g, ""); // Generate username from fullName

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            email,
            contact,
        });

        genarateToken(newUser._id, res); // Generate token

        await newUser.save(); // Save user to the database

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            msg: "User created successfully",
        });
    } catch (err) {
        console.error("Error in signup controller:", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }
};


export const login = async(req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ msg: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        genarateToken(user._id, res);   

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            msg: "Logged in successfully",
        });
    }
    catch(err){
        console.error("Error in login controller:", err.message);
        res.status(500).json({ msg: "Something went wrong" });
    }   
    
};

export const logout = (req, res) => {
   try{
         res.clearCookie("jwt");
         res.status(200).json({ msg: "Logged out successfully" }); 
    }catch(err){
       console.error("Error in logout controller:", err.message);
       res.status(500).json({ msg: "Something went wrong" });
   }
};
