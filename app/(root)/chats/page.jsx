"use client"
import { useSession } from "next-auth/react";
import React from "react";

const Chat = () => {
  const { data: session } = useSession();
  console.log(session);
  return <div>Chat</div>;
};

export default Chat;
