"use client";
import ChatDetails from "@/components/ChatDetails";
import ChatList from "@/components/ChatList";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";


const ChatPage = () => {
  const { chatId } = useParams();
  const { data: sessions } = useSession();
  const currentUser = sessions?.user;
  
  return <div className="main-container">
    <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
      <ChatList currentChatId={chatId} />
    </div>
    <div className="w-2/3 max-lg:w-1/2 max-md:w-full">
      <ChatDetails chatId={chatId} currentUser={currentUser} />
    </div>
  </div>;
};

export default ChatPage;
