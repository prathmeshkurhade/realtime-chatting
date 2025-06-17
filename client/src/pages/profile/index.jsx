import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { HOST } from "@/utils/constants"; // Import HOST from constants.js
import { GET_USER_INFO, UPDATE_PROFILE_ROUTE, ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState();
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const response = await apiClient.get("/api/auth/user-info", { withCredentials: true });
            if (response.status === 200 && response.data) {
                setUserInfo(response.data);
                setFirstName(response.data.firstName || "");
                setLastName(response.data.lastName || "");
                setColor(response.data.color || 0);
                if (response.data.image) {
                    setImage(`${HOST}/${response.data.image}`);
                }
            } else {
                navigate("/auth"); // Redirect to auth if user info is not available
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            navigate("/auth"); // Redirect to auth on error
        }
    };

    fetchUserInfo();
}, [navigate, setUserInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            color,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      } catch (error) {
        console.error("Error during saveChanges:", error);
        toast.error("Failed to update profile.");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Fill details bro");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);

      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Image updated successfully");
        }
      } catch (error) {
        console.error("Error during image upload:", error);
        toast.error("Failed to upload image");
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 p-5">
      <div className="relative w-full max-w-[600px] bg-[#2c2d35] rounded-lg shadow-lg p-8">
        {/* Back Button */}
        <button
          className="absolute top-4 left-4 text-white text-2xl hover:text-blue-300 transition"
          onClick={handleNavigate}
        >
          <IoArrowBack />
        </button>

        {/* Profile Photo */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative h-32 w-32 md:w-48 md:h-48 flex items-center justify-center rounded-full overflow-hidden border-2 border-gray-500"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-full w-full rounded-full">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className={`uppercase text-5xl flex items-center justify-center ${getColor(
                    color
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute bottom-2 right-2 text-white text-xl bg-black rounded-full p-2 hover:bg-gray-700 transition"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            name="profile-image"
            accept=".png, .svg ,.jpeg ,.jpg, .webp"
            onChange={handleImageChange}
          />
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4 mt-6">
          <input
            type="text"
            value={userInfo.email}
            disabled
            className="bg-[#3a3b44] text-white p-3 rounded-md border border-gray-600 focus:outline-none"
          />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="bg-[#3a3b44] text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="bg-[#3a3b44] text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Color Options */}
        <div className="flex gap-4 mt-6 justify-center">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              className={`h-10 w-10 rounded-full border-2 border-gray-500 ${getColor(
                index
              )} hover:scale-110 transition`}
              onClick={() => setColor(index)}
            ></button>
          ))}
        </div>

        {/* Save Changes Button */}
        <button
          className="bg-purple-600 text-white p-3 rounded-md w-full mt-6 hover:bg-purple-700 transition"
          onClick={saveChanges}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
