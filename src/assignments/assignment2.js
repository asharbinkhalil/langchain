import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import * as dotenv from "dotenv";
import readline from 'readline';

dotenv.config();

const model = new ChatFireworks({
    temperature: 0.7,
    maxTokens: 100,
    verbose: false,
});

const prompt = ChatPromptTemplate.fromTemplate(
    `You are a chatbot that answers questions specifically about the compant Emumba and its loan policy. If you are aksed a question that is not related to Emumba or its loan policy, respond with "I do not have information about that".
     Input: {input}
     Context: {context}
     Question: {input}`
);

const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: prompt,
});

const loader = new CheerioWebBaseLoader("https://pastebin.com/raw/xZABSgb7");
const docs = await loader.load();

// Function to initiate the chat
const startChat = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askQuestion = async () => {
        rl.question('You: ', async (input) => {
            const response = await chain.invoke({
                input: input,
                context: docs,
            });
            console.log('Chatbot:', response);
            askQuestion(); // Prompt for the next question
        });
    };

    askQuestion(); // Start the chat
};

// Start the chatbot
startChat();
