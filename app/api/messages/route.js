import { pusherServer } from "@/lib/pusher";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: newMessage._id,
        },
        $set: {
          lastMessageAt: newMessage.createdAt,
        },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();
    // Trigger a new message event to the chatId channel
    // This will trigger a new message event to the chatId channel
    await pusherServer.trigger(chatId, "new-message", newMessage);

    // Trigger a new message event to the members of the chat
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(
          member._id.toString(),
          "updated-chat",
          {
            id: chatId,
            message: [lastMessage],
          }
        );
      } catch (err) {
        console.log(err);
      }
    });
    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to send message", { status: 500 });
  }
};
