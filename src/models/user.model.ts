import mongoose, { Schema } from "mongoose";

const chatMessageSchema: Schema = new Schema({
  sender: { type: String, enum: ["user", "ai"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema: Schema = new Schema({
  movieName: { type: String, required: true },
  characterName: { type: String, required: true },
  messages: [chatMessageSchema],
});

const userSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  socketId: { type: String, default: null },
  chats: [chatSchema],
});

const User = mongoose.model("User", userSchema);

export default User;
