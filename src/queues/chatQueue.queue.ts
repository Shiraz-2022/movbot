import Queue from "bull";
import pc from "@/configs/pinecone.config";
import OpenAIServices from "@/services/openai.services";
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

  // Generate embedding for the user message
  const queryEmbedding = await OpenAIServices.getEmbedding(userMessage);
  const queryVector = queryEmbedding.data[0].embedding;

  // Retrieve stored keys from Redis
  const storedKeys = await redis.hkeys("dialogues");
  let bestMatch = null;
  let highestSimilarity = 0;

  for (const key of storedKeys) {
    if (!key.startsWith(cacheKeyPrefix)) continue;

    const cachedData = JSON.parse(await redis.hget("dialogues", key));
    const similarity = cosineSimilarity(queryVector, cachedData.embedding);

    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = cachedData;
    }
  }

  // If similarity threshold is met, use cached dialogues
  if (bestMatch && highestSimilarity > 0.85) {
    cacheHit = true;
    console.log("Cache hit - Returning similar cached dialogues");

    return OpenAIServices.generateCharacterResponse(
      bestMatch.dialogues,
      userMessage
    );
  }

  // If no cache hit, query Pinecone
  const index = pc.Index("movie-scripts");
  const results = await index.query({
    vector: queryVector,
    topK: 5,
    includeMetadata: true,
    filter: {
      movieTitle: movieName,
      ...(character ? { character: character } : {}),
    },
  });

  const retrievedDialogues = results.matches.map(
    (match) => match.metadata.dialogue
  );

  // Cache the new dialogues with embedding
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
});

export default dialogueQueue;
