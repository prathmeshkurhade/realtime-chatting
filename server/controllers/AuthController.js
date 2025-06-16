import { compare } from 'bcryptjs';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const maxAge = 3 * 24 * 60 * 60; // in seconds

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.create({
            email,
            password,
            profileSetup: false,    
        });
        res.cookie("jwt", createToken(email, user.id), {
            maxAge: maxAge * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });
        return res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const auth  = await compare(password, user.password);
        if (!auth) {
            return res.status(401).send("Invalid credentials");
        }
        
        res.cookie("jwt", createToken(email, user.id), {
            maxAge: maxAge * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserInfo = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User with given ID not found");
        }

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,    
            image: userData.image,  
            color: userData.color,
        });
    } catch (error) {
        console.error("Error during getUserInfo:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color, image } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).send("First name and last name are required");
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                image,
                profileSetup: true,
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.error("Error during updateProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};