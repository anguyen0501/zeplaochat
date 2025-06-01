"use client";
import ChatDetails from "@/components/ChatDetails";
import ChatList from "@/components/ChatList";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const ChatPage = () => {
  const { chatId } = useParams();
  const { data: sessions } = useSession();
  const currentUser = sessions?.user;

  const seenAllMessages = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId: currentUser._id }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) {
      seenAllMessages();
    }
  }, [currentUser, chatId]);

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:w-1/2 max-md:w-full">
        <ChatList currentChatId={chatId} />
      </div>
      <div className="w-2/3 max-lg:w-1/2 max-md:w-full">
        <ChatDetails chatId={chatId} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default ChatPage;
