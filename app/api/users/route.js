import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export const GET = async (req, res) => {
    try {
        await connectToDB();

        const users = await User.find({});
        return new Response(JSON.stringify(users), { status: 200 });
     } catch (err) {
        console.log(err);
        return new Response("Failed to fetch all users", { status: 500 });
    }
}