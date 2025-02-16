import { Server, Socket } from "socket.io";
import dialogueQueue from "@/queues/chatQueue.queue";
import User from "@/models/user.model";

export default function handleChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on(
      "userMessage",
      async ({ userId, userMessage, movieName, character }) => {
        console.log("New message received:", userMessage);

        try {
          let user = await User.findOne({ userId });

          if (!user) {
            user = new User({ userId, chats: [] });
          }

          // Find the specific chat session for the given movie and character
          let chatSession = user.chats.find(
            (chat) =>
              chat.movieName === movieName && chat.characterName === character
          );

          if (!chatSession) {
            chatSession = { movieName, characterName: character, messages: [] };
            user.chats.push(chatSession);
          }

          chatSession.messages.push({ sender: "user", message: userMessage });

          await user.save();

          // Add job to queue for AI response
          const job = await dialogueQueue.add({
            userMessage,
            movieName,
            character,
          });

          job
            .finished()
            .then(async (response) => {
              socket.emit("chatResponse", { message: response });
              chatSession.messages.push({ sender: "ai", message: response });
              await user.save();
            })
            .catch((error) => {
              console.error("Job processing failed:", error);
              socket.emit("chatError", { error: "Failed to process chat" });
            });
        } catch (error) {
          console.error("Error handling chat:", error);
          socket.emit("chatError", { error: "Server error" });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
