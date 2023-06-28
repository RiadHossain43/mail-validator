const { openai } = require("../../.config/gpt");

class PromptEngineering {
  constructor() {}
  async streamResponse(payload) {
    return openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages: [
          ...payload.conversation,
          ...payload.systemInstructions,
          { role: "user", content: `${payload.prompt}` },
        ],
        max_tokens: 2550,
        stream: true,
        temperature: 0.2,
      },
      {
        responseType: "stream",
      }
    );
  }
  async normalResponse(payload) {
    return openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        ...payload.conversation,
        ...payload.systemInstructions,
        { role: "user", content: `${payload.prompt}` },
      ],
      max_tokens: 2550,
      temperature: 0.2,
    });
  }
  async imageResponse(payload) {
    let response = await openai.createImage({
      prompt: payload.prompt,
      n: payload.n || 1,
      size: payload.size || "512x512",
    });
    return response.data.data;
  }
}

module.exports = { PromptEngineering };
