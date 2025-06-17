import User from "../models/UserModel.js";



export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    
    if (!searchTerm) {
      return res.status(200).json({ contacts: [] });
    }

    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } }, // Exclude current user
        {
          $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
            { email: { $regex: regex } }
          ]
        }
      ]
    }).select('-password'); // Exclude password field

    console.log('Found contacts:', contacts); // Debug log

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Search contacts error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};