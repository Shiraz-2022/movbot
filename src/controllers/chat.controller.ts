import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import chatQueue from "@/queues/chatQueue.queue";
import User from "@/models/user.model";

class OpenAIController {
  chatWithBot = async (req: Request, res: Response, next: NextFunction) => {
    const {
      character,
      userMessage,
      movieName,
    }: { character: string; userMessage: string; movieName: string } = req.body;

    try {
      // Add a job to the queue
      const job = await chatQueue.add({
        userMessage,
        movieName,
        character,
      });

      job
        .finished()
        .then((response) => {
          res.success(StatusCodes.OK, "Chat generated successfully", {
            response,
          });
        })
        .catch((error) => {
          console.error("Job processing failed:", error);
          next(error);
        });
    } catch (error) {
      console.error("Error adding job to the queue:", error);
      next(error);
    }
  };

  getChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.error(StatusCodes.NOT_FOUND, "User ID is required");
      }

      const user = await User.findOne({ userId }).select("chats");

      if (!user) {
        res.error(StatusCodes.NOT_FOUND, "User not found");
      }

      res.success(StatusCodes.OK, "Chats retrieved successfully", {
        chats: user.chats,
      });
    } catch (error) {
      console.error("Error retrieving chats:", error);
      next(error);
    }
  };
}

export default new OpenAIController();
