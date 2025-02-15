import openai from "@/configs/openai.config";

class OpenAIServices {
  getEmbedding = async (text: string) => {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return embedding;
  };

  generateCharacterResponse = async (dialogues: any, userMessage: string) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI trained to respond exactly like the movie character. Below are some dialogues spoken by the character in the movie:\n\n${dialogues.join(
            "\n"
          )}\n\nYour task is to generate a response that closely matches the character's speech patterns, tone, and vocabulary.`,
        },
        { role: "user", content: userMessage },
      ],
    });
    return completion.choices[0].message.content;
  };
}

export default new OpenAIServices();
