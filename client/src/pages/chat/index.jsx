import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";
import { useAppStore } from "@/store";

const Chat = () => {
  const { userInfo, selectedChatType } = useAppStore(); // Fix: Use selectedChatType instead of setselectedChatType
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("please setup your profile first");
      navigate("/profile"); 
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {selectedChatType ? <ChatContainer /> : <EmptyChatContainer />} {/* Fix: Check selectedChatType instead of setselectedChatType */}
    </div>
  );
};

export default Chat;
