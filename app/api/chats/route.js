import { connectToDB } from "@/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { pusherServer } from "@/lib/pusher";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { currentUserId, members, isGroup, name, groupPhoto } = body;
    // Define query to find the chat
    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 2 } };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = await new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );
      await chat.save();

      const updateAllMembers = chat.members.map(async (memberId) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: {
              chats: chat._id,
            },
          },
          { new: true }
        );
      });
      Promise.all(updateAllMembers);

      // Trigger a new chat event to the members of the chat
      chat.members.map(async (member) => {
        await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    }


    const responseData = {
      message: "Chat created successfully",
      chat: chat,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
    const errorData = {
      message: "Failed to create chat",
      error: err.message,
    };

    return new Response(JSON.stringify(errorData), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
