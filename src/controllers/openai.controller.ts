import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import chatQueue from "@/queues/chatQueue.queue"; // Import the Bull queue

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

      // Wait for the job to finish and get the result
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
}

export default new OpenAIController();
