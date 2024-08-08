import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";


import * as dotenv from "dotenv"; 
dotenv.config();


const model = new ChatFireworks(
    {
       
        temperature:0.7,
        maxTokens: 100,
        verbose: true
    }
);
//from templates
// const prompt = ChatPromptTemplate.fromTemplate("You are a comedian, Tell a joke base on the following word {word}");

// // console.log(await prompt.format({word:"dog"}));   check if the imput is working
// //create chain
// const chain = prompt.pipe(model);

// //call chain
// const response = await chain.invoke({word:"dog"});
// console.log(response);


//from messages
const prompt2 = ChatPromptTemplate.fromMessages(
[
    ["system", "Generate a joke based on the word provided by user"],
    ["human", "{input}"]
]);

//cretae chain
const chain2 = prompt2.pipe(model);

//call chain
const response2 = await chain2.invoke({input:"dog"});
console.log(response2);