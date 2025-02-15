import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

import openaiRoutes from "@/routes/openai.route";
import { errorHandler } from "@/middlewares/errorHandler.middleware";
import routeHandler from "./middlewares/routeHandler.middleware";
import connectMongoDB from "@/configs/mongodb.config";
import limiter from "./middlewares/rateLimitter.middleware";
import handleChatSocket from "@/sockets/chat.socket";

const app = express();
dotenv.config();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

handleChatSocket(io);

connectMongoDB();
//middlewares
app.use(express.json());
app.use(routeHandler);
app.use(limiter);

//routes
app.use("/api/openai", openaiRoutes);

app.use(errorHandler);

// app.listen(3000, () => console.log("Server is running on port 3000"));
server.listen(3000, () => {
  console.log("Server running on port 3000");
});

export default app;
