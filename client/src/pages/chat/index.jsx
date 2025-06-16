import { use } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

const Chat = () => {

  const {userInfo} = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("please setup your profile first");
      navigate("/profile"); 
    }
  }, [userInfo, navigate]);
  return (
    <div>
      Chat
    </div>
  )
}

export default Chat
