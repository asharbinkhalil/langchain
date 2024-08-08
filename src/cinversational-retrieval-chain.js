import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "langchain/document";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

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
const prompt = ChatPromptTemplate.fromTemplate(
        `Answer the User Question. {input}
         Context: {context}
         Question: {input}
        `);


const chain =await createStuffDocumentsChain({
    llm:model,
    prompt:prompt,
});

const loader= new CheerioWebBaseLoader("https://python.langchain.com/v0.1/docs/expression_language/")
const docs=await loader.load();

const splitter= new Res

//call chain
const response = await chain.invoke({
    input: "What is the LCEL?",
    context: docs,

});
console.log(response);


