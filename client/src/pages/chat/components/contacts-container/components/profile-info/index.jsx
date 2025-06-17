import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import {  useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { LogOut } from "lucide-react";





const ProfileInfo = () => {
  const { userInfo , setUserInfo} = useAppStore();
  const navigate = useNavigate()

  const logOut =async () => {
    try {
        const res=  await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {withCredentials: true}
    )


if(res.status===200) {
    navigate("/auth")
    setUserInfo(null)
}}
    catch(error) {
        console.log(error)
    }
  };
  return (
    <div className="absolute bottom-0 h-15 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="h-12 w-12 relative">
          <Avatar className="h-full w-full rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <div
                className={`uppercase text-2xl flex items-center justify-center h-full w-full rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <Tooltip>
          <TooltipTrigger>
            <FiEdit2 className="text-purple-500 text-xl"
            onClick={()=> navigate('/profile')} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Profile</p>
          </TooltipContent>
        </Tooltip>
                <Tooltip>
          <TooltipTrigger>
            <IoLogOut className="text-red-500 text-xl"
            onClick={logOut} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileInfo;
