"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import ChatBox from "./ChatBox";

const ChatList = () => {
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
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
