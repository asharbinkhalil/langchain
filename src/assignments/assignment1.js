import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";
import readline from "readline";

// Load environment variables
dotenv.config();

// Initialize the chat model with specific parameters
const model = new ChatFireworks({
  temperature: 0.7,
  maxTokens: 100,
  verbose: false,
});

// Define the prompt template for messages
const prompt2 = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a chatbot that answers questions specifically about movies. 
     If the question is not related to movies, respond with "I do not have information about that".
     
     Q: Explain to me the plot for Dr No.
     A: Dr. No is the first James Bond film, released in 1962. It follows the British secret agent James Bond as he investigates the disappearance of a fellow agent in Jamaica. Bond uncovers a plot by the titular villain, Dr. No, to disrupt an American space launch with a powerful radio beam.

     Q: What is the name of the president of Pakistan?
     A: I do not have information about that.`,
  ],
  ["human", "{input}"],
]);

// Create the chat chain
const chain2 = prompt2.pipe(model);

// Function to handle user input and chatbot response
async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Chatbot is ready. Ask me anything about movies!");

  // Use a recursive function to keep the chat going
  function askQuestion() {
    rl.question("You: ", async (userInput) => {
      if (userInput.toLowerCase() === "exit") {
        console.log("Goodbye!");
        rl.close();
        return;
      }

      // Get the chatbot's response
      const response2 = await chain2.invoke({ input: userInput });
      console.log(`Chatbot: ${response2.text}`);

      // Continue the conversation
      askQuestion();
    });
  }

  // Start the chat
  askQuestion();
}

// Run the chat function
chat();
