import User from "@/models/User";
import { connectToDB } from "@/mongodb";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();

        const searchQuery = params.query;

        const searchContacts = await User.find({
            $or: [
                { username: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
            ],
        });

        return new Response(JSON.stringify(searchContacts), { status: 200 });
    } catch (err) {
        return new Response("Failed to search contacts", { status: 500 });
    }
}