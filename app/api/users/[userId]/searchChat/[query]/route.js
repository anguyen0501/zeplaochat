import { connectToDB } from "@/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";
import Message from "@/models/Message";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    // const currentUserId = await params.userId;

    // const query = await params.query;

    const { userId, query } = await params;

    const searchChats = await Chat.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: User },
      })
      .exec();

    return new Response(JSON.stringify(searchChats), { status: 200 });
  } catch (error) {
    return new Response("Failed to search chats", { status: 500 });
  }
};
