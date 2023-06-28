const { logger } = require("../../common/helper");
const { PromptEngineering } = require("../services");
exports.generateConversationResponse = async (req, res, next) => {
  try {
    const promptEngineering = new PromptEngineering();
    const aliceResponse = await promptEngineering.streamResponse(req.body);
    const alicestream = aliceResponse.data;
    alicestream.on("data", (data) => {
      /** following algorithm extracts texts from stream, good to be utilised in client side */
      // const jsonChunks = data.toString().split("data: ");
      // try {
      //   for (let chunk of jsonChunks) {
      //     if (chunk) {
      //       if (chunk.trim() === "[DONE]") break;
      //       logger.info("Streaming data...");
      //       let dataobject = JSON.parse(chunk);
      //       if (dataobject.choices[0].delta.content) {
      //         res.write(dataobject.choices[0].delta.content);
      //       }
      //     }
      //   }
      // } catch (err) {
      //   logger.info(err);
      // }
      logger.info("streaming data...");
      res.write(data);
    });
    alicestream.on("end", () => {
      logger.info("stream done");
      res.end();
    });
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
        responseMessage: aliceResponse.data.choices[0].message.content,
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
