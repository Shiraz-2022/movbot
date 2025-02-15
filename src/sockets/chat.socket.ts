import { Server, Socket } from "socket.io";
import dialogueQueue from "@/queues/chatQueue.queue";

export default function handleChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("userMessage", async ({ userMessage, movieName, character }) => {
      console.log("New message received:", userMessage);

      // Add job to queue
      const job = await dialogueQueue.add({
        userMessage,
        movieName,
        character,
      });

      // Emit the final response when the job is done
      job
        .finished()
        .then((response) => {
          socket.emit("chatResponse", { message: response });
        })
        .catch((error) => {
          console.error("Job processing failed:", error);
          socket.emit("chatError", { error: "Failed to process chat" });
        });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
