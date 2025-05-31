import Chat from "@/models/Chat";
import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { chatId } = await params;

    const chat = await Chat.findById(chatId)
      .populate({
        path: `members`,
        model: User,
      })
      .exec();

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get chat details", { status: 500 });
  }
};
