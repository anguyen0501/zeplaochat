"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import ChatBox from "./ChatBox";
import { pusherClient } from "@/lib/pusher";

const ChatList = ({ currentChatId }) => {
  const { data: sessions } = useSession();
  const currentUser = sessions?.user;
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const getChats = async () => {
    try {
      const res = await fetch(
        searchQuery !== ""
          ? `/api/users/${currentUser._id}/searchChat/${searchQuery}`
          : `/api/users/${currentUser._id}`
      );

      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, searchQuery]);

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);
      const handleChatUpdate = (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return {
                ...chat,
                messages: updatedChat.messages,
              };
            }
            return chat;
          })
        );
      };

      const handleNewChat = (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      };
      pusherClient.bind("updated-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);
      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("updated-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);
  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        placeholder="Search chat..."
        className="input-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="chats">
        {chats?.map((chat, index) => (
          <ChatBox
            key={chat._id || index}
            chat={chat}
            index={index}
            currentUser={currentUser}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
