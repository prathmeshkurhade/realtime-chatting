import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { FaPlus } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";

const NewDM = () => {
  const{setselectedChatType, setselectedChatData} = useAppStore()
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length === 0) {
        setSearchedContacts([]);
        return;
      }

      const { data } = await apiClient.post(
        SEARCH_CONTACTS_ROUTE,
        { searchTerm },
        { withCredentials: true }
      );

      console.log("Search results:", data); // Debug log
      
      if (data?.contacts) {
        setSearchedContacts(data.contacts);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      setSearchedContacts([]);
      setselectedChatData(contact)
      setselectedChatType("contact")
    }
  };


  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSearchedContacts([])
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger>
          <FaPlus
            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transiton-all duration-300"
            onClick={() => setOpenNewContactModel(true)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <span>Select New Contact</span>
        </TooltipContent>
      </Tooltip>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Direct Message</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search contacts..."
            className="rounded-lg p-6 bg-[#2c2e3b] border-none text-white"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              searchContacts(e.target.value);
            }}
          />
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer hover:bg-[#2c2e3b] p-2 rounded-lg"
                  onClick={() =>selectNewContact(contact)}
                >
                  <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                    {contact.image ? (
                      <AvatarImage
                        src={`${HOST}/${contact.image}`}
                        alt="profile"
                        className="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <div
                        className={`uppercase text-2xl flex items-center justify-center h-full w-full rounded-full ${getColor(
                          contact.color
                        )}`}
                      >
                        {contact.firstName
                          ? contact.firstName.charAt(0)
                          : contact.email.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName} {contact.lastName}
                    </span>
                    <span className="text-sm text-gray-400">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
