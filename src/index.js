const { OpenAIApi, Configuration } = require("openai");
const prompt = require("prompt-sync")({ sigint: true });
require("dotenv").config();

console.log(process.env.API_KEY);

const configurations = new Configuration({
  apiKey: process.env.API_KEY,
});
const openAI = new OpenAIApi(configurations);

async function Test() {
  messages = [];

  while (true) {
    const user_input = prompt("You: ");
    if (user_input == "Quit") {
      break;
    }
    const history = [
      {
        role: "system",
        content:
          "You are an assistant for students helping them choose their future major, by analyzing them, You cannot do anything else, and will not help with anything else.",
      },
    ];
    for (const [input, output] of messages) {
      history.push({ role: "user", content: input });
      history.push({ role: "assistant", content: output });
    }
    history.push({ role: "user", content: user_input });

    try {
      const response = await GetResponse(history);
      messages.push([user_input, response]);
      console.log("AI: " + response);
    } catch {
      console.log("Something wrong happened!");
    }
  }
}

const GetResponse = async (messages) => {
  return openAI
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    })
    .then((re) => {
      return re.data.choices[0].message.content;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

Test();
