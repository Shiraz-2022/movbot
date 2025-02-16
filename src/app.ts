import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

import chatRoutes from "@/routes/chat.route";
import { errorHandler } from "@/middlewares/errorHandler.middleware";
import routeHandler from "./middlewares/routeHandler.middleware";
import connectMongoDB from "@/configs/mongodb.config";
import limiter from "./middlewares/rateLimitter.middleware";
import handleChatSocket from "@/sockets/chat.socket";
import { StatusCodes } from "http-status-codes";

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
app.use("/api/chat", chatRoutes);

app.get("/", (req: Request, res: Response) => {
  res.success(StatusCodes.OK, "Welcome to the place where magic happens");
});

app.use(errorHandler);

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

export default app;
