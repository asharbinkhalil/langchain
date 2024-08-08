import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser ,CommaSeparatedListOutputParser,ListOutputParser} from "@langchain/core/output_parsers";

import * as dotenv from "dotenv";
dotenv.config();


const model = new ChatFireworks(
    {
        temperature: 0.7,
        maxTokens: 100,
        verbose: true
    }
);

async function callStringOutputParser() {
    const prompt = ChatPromptTemplate.fromMessages(
        [
            ["system", "Generate a joke based on the word provided by user"],
            ["human", "{input}"]
        ]);

    const parser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(parser);

    return await chain.invoke( { input: "dog" });

}

// const response = await callStringOutputParser();

// console.log(response);


async function callListOutputParser()
{
    const prompt = ChatPromptTemplate.fromTemplate(
        `Provide 5 synonyms, separated by commas, for the following word {word}`
    )

    const outputPaser=  new CommaSeparatedListOutputParser();
    const chain=prompt.pipe(model).pick(outputPaser);
    return await chain.invoke({word:"happy"});
}
const response=await callListOutputParser();
console.log(response);