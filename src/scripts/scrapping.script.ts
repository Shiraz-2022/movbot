import axios from "axios";
import * as cheerio from "cheerio";
import connectMongoDB from "@/configs/mongodb";
import { MongoClient } from "mongodb";

const scrapeScript = async () => {
  try {
    await connectMongoDB();
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    await client.connect();

    const db = client.db("movieDB");
    const movieTitle = "TheBrutalist";
    const collectionName = `movie_${movieTitle
      .replace(/\s+/g, "_")
      .toLowerCase()}`;
    const movieCollection = db.collection(collectionName);

    const url = "https://imsdb.com/scripts/Brutalist,-The.html";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const scriptText = $("pre").text();

    // Clean the text
    const cleanedScriptText = scriptText
      .replace(/\[.*?\]/g, "")
      .replace(/\n{2,}/g, "\n");

    // Regex to match character names followed by dialogue
    const pattern = /([A-Z ]+)\n([\s\S]+?)(?=\n[A-Z ]+\n|$)/g;
    let match;

    while ((match = pattern.exec(cleanedScriptText)) !== null) {
      const character = match[1].trim();
      const dialogue = match[2].replace(/\s+/g, " ").trim(); // Removes extra spaces & newlines

      await movieCollection.insertOne({
        character,
        dialogue,
      });
    }

    console.log(`Script stored in collection: ${collectionName}`);
    await client.close();
  } catch (error) {
    console.error("Error scraping script:", error);
  }
};

scrapeScript();
