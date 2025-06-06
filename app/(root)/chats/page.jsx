
import ChatList from "@/components/ChatList";
import Contacts from "@/components/Contacts";
import React from "react";

const Chat = () => {

  return <div className="main-container">
    <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
      <ChatList />
    </div>
    <div className="w-2/3 max-lg:w-1/2 max-md:w-full">
      <Contacts />
    </div>
  </div>;
};

export default Chat;
