import { Router } from "express";
import { signup, login, getUserInfo, updateProfile ,addProfileImage,removeProfileImage} from "../controllers/AuthController.js"; // Ensure login is imported
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const upload = multer({
    dest: "uploads/profiles/", // Ensure this folder exists
});

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login); // Add this line
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
    "/add-profile-image",
    verifyToken,
    upload.single("profile-image"), // Ensure the field name matches the frontend
    addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage)
export default authRoutes;