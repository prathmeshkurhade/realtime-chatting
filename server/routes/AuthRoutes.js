import { Router } from "express";
import { signup, login, getUserInfo, updateProfile ,addProfileImage,removeProfileImage} from "../controllers/AuthController.js"; // Ensure login is imported
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import User from "../models/UserModel.js"; // Import the User model

const upload = multer({
    dest: "uploads/profiles/", // Ensure this folder exists
});

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login); // Add this line
authRoutes.get("/user-info", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).send("User not found");

        res.status(200).json({
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            color: user.color,
            image: user.image,
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).send("Internal server error");
    }
});
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
    "/add-profile-image",
    verifyToken,
    upload.single("profile-image"), // Ensure the field name matches the frontend
    addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage)
export default authRoutes;