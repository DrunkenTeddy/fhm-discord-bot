const { Configuration, OpenAIApi } = require("openai");
const { openAI }                   = require("../config.json");

const OPENAI_API_KEY = openAI;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getChatCompletion = async (prompt) => {
  const chatPayload = {
    model    : "gpt-3.5-turbo",
    messages : [{ role: "system", content: prompt }],
  };

  try {
    const chatCompletion = await openai.createChatCompletion(chatPayload);
    console.log(chatCompletion.data);
    return chatCompletion.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Something went wrong.";
  }
};

module.exports = {
  getChatCompletion,
};
