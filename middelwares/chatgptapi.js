const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config()



const chatGPT = async (role,content)=>{
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const messages = [];
      messages.push({ role: role, content: content });
      try {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messages,
        });
        const completionText = completion.data.choices[0].message.content;
        return completionText.trim();
      } catch (error) {
         return error;
      }
}

module.exports = {chatGPT}
