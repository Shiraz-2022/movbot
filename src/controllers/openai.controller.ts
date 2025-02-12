import openai from "@/configs/openai.config";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

class OpenAIController {
  chatWithBot = async (req: Request, res: Response, next: NextFunction) => {
    const {
      character,
      userMessage,
      movieName,
    }: { character: string; userMessage: string; movieName: string } = req.body;

    const characterPersona =
      "You are a sarcastic bot who answers with a hint of disdain.";

    try {
      // Construct the collection name
      const collectionName = `movie_${movieName
        .replace(/\s+/g, "")
        .toLowerCase()}`;

      // Access the correct database (movieDB)
      const database = mongoose.connection.useDb("movieDB");

      // Check if the collection exists
      const collections = await database.listCollections();
      const collectionExists = collections.some(
        (col) => col.name === collectionName
      );

      let response;

      console.log(collections);
      console.log(collectionExists);

      if (collectionExists) {
        // Get the collection
        const collection = database.collection(collectionName);

        // Perform the fuzzy search with exact character match
        const results = await collection
          .find(
            {
              $text: { $search: `${character} ${userMessage}` },
            },
            {
              score: { $meta: "textScore" }, // Add a score to the results
            }
          )
          .sort({ score: { $meta: "textScore" } }) // Sort by score
          .limit(5)
          .toArray();

        if (results.length > 0) {
          response = results[0];
        } else {
          response = null; // No matching dialogue found
        }
      } else {
        // If the collection doesn't exist, use OpenAI to generate a response
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: characterPersona },
            { role: "user", content: userMessage },
          ],
        });

        response = completion.choices[0].message.content;
      }

      if (!response) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "No matching dialogue found" });
      }

      res.success(StatusCodes.OK, "Chat generated successfully", {
        response: response,
      });
    } catch (error) {
      console.error("OpenAI API Error:", error);
      next(error);
    }
  };
}

export default new OpenAIController();
