const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});
module.exports = {
  openai,
};
