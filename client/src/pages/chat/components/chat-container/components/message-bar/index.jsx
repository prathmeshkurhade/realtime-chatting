import EmojiPicker from "emoji-picker-react";
import { useState , useRef, useEffect}  from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

const MessageBar = () => {
  const emojiRef =useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false); // Close the emoji picker
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji); // Append the selected emoji to the message
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") {
      console.error("Message cannot be empty");
      return;
    }
    try {
      console.log("Sending message:", message);
      // Add your message sending logic here
      setMessage(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="absolute bottom-0 w-full bg-[#1c1d25] flex justify-center items-center px-8 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen((prev) => !prev)} // Toggle emoji picker
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0 z-50 "ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji} // Handle emoji selection
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
        <button
          className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline:none focus:text-white duration-300 transition-all"
          onClick={handleSendMessage}
        >
          <IoSend className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
