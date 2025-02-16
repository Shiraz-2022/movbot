import Queue from "bull";
import pc from "@/configs/pinecone.config";
import OpenAIServices from "@/services/chat.services";
import redis, { redisConfig } from "@/configs/redis.config";
import cosineSimilarity from "@/helpers/cosineSimilarity.helper";

const dialogueQueue = new Queue("dialogueProcessing", { redis: redisConfig });
dialogueQueue.setMaxListeners(100);

dialogueQueue.process(5, async (job) => {
  const { userMessage, movieName, character } = job.data;
  let cacheHit = false;
  const cacheKeyPrefix = `pinecone:${movieName
    .toLowerCase()
    .replace(/\s+/g, "_")}:${character ? character.toLowerCase() : "all"}`;

  // Run embedding and Redis query in parallel
  const [queryEmbedding, storedData] = await Promise.all([
    OpenAIServices.getEmbedding(userMessage),
    redis.hgetall("dialogues"),
  ]);
  const queryVector = queryEmbedding.data[0].embedding;

  // Filter relevant cache entries
  const filteredEntries = Object.entries(storedData).filter(([key]) =>
    key.startsWith(cacheKeyPrefix)
  );

  // Compute similarity for all cached dialogues in one go
  const matches = filteredEntries.map(([key, value]) => {
    const cachedData = JSON.parse(value);
    return {
      cachedData,
      similarity: cosineSimilarity(queryVector, cachedData.embedding),
    };
  });

  // Find best match
  const bestMatch = matches.reduce(
    (acc, curr) => (curr.similarity > acc.similarity ? curr : acc),
    { similarity: 0 }
  );

  // Use cache if similarity threshold is met
  if (bestMatch.similarity > 0.85) {
    console.log("Cache hit - Returning similar cached dialogues");
    return OpenAIServices.generateCharacterResponse(
      bestMatch.cachedData.dialogues,
      userMessage
    );
  }

  // Run Pinecone query in parallel (if needed)
  const pineconeQuery = bestMatch.cachedData
    ? Promise.resolve(null)
    : pc.Index("movie-scripts").query({
        vector: queryVector,
        topK: 5,
        includeMetadata: true,
        filter: { movieTitle: movieName, ...(character ? { character } : {}) },
      });

  const results = await pineconeQuery;

  // Extract and cache new dialogues
  if (results) {
    const retrievedDialogues = results.matches.map(
      (match) => match.metadata.dialogue
    );

    await redis.hset(
      "dialogues",
      `${cacheKeyPrefix}:${userMessage}`,
      JSON.stringify({ dialogues: retrievedDialogues, embedding: queryVector })
    );

    console.log("Cache miss - Retrieved dialogues from Pinecone");

    return OpenAIServices.generateCharacterResponse(
      retrievedDialogues,
      userMessage
    );
  }
});

// Monitor job performance
dialogueQueue.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

dialogueQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

export default dialogueQueue;
