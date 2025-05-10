import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "",
    },
    chats: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
        default: [],
    },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
// This code defines a Mongoose schema for a User model in a MongoDB database.
// The schema includes fields for username, email, password, profileImage, and chats.
// The username, email, and password fields are required, and the email field must be unique.
// The chats field is an array of ObjectId references to a Chat model, with a default value of an empty array.
// The User model is exported for use in other parts of the application.
// The code also includes a check to see if the User model already exists in Mongoose's models object,
// and if it does, it uses that existing model instead of creating a new one.