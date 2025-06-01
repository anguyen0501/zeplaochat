import { connectToDB } from "@/mongodb";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId } = params;

    const { name, groupPhoto } = body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    );

    return new Response(JSON.stringify(updatedChat), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update group chat info", { status: 500 });
  }
};
