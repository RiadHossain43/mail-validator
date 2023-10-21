const { PromptEngineering } = require("../services");
exports.generateConversationResponse = async (req, res, next) => {
  try {
    const promptEngineering = new PromptEngineering();
    const aliceResponseStream = await promptEngineering.streamResponse(
      req.body
    );
    for await (const part of aliceResponseStream) {
      res.write(part.choices[0]?.delta?.content || "");
    }
    res.end();
  } catch (error) {
    next(error);
  }
};
exports.generateNormalResponse = async (req, res, next) => {
  try {
    const promptEngineering = new PromptEngineering();
    const aliceResponse = await promptEngineering.normalResponse(req.body);
    res.status(200).json({
      message: "Response found.",
      details: {
        responseMessage: aliceResponse.choices[0].message.content,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.generateImageResponse = async (req, res, next) => {
  try {
    const promptEngineering = new PromptEngineering();
    const response = await promptEngineering.imageResponse(req.body);
    res.status(200).json({
      message: "Image generated.",
      details: {
        prompt: req.body.prompt,
        generations: response,
      },
    });
  } catch (error) {
    next(error);
  }
};
