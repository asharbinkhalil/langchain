import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "langchain/document";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";


import * as dotenv from "dotenv";

import { load } from "langchain/load";
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

// console.log(await prompt.format({word:"dog"}));   check if the imput is working
//create chain
const chain =await createStuffDocumentsChain({
    llm:model,
    prompt:prompt,
});


//Load data from web page
const loader= new CheerioWebBaseLoader("https://python.langchain.com/v0.1/docs/expression_language/")
const docs=await loader.load();
console.log(docs);


const splitter= new RecursiveCharacterTextSplitter({
    chunkSize:200,
    chunkOverlap: 20,
});

const splitDocs= await splitter.splitDocuments(docs);

///now we want only relevant documnet
const embeddings=new OpenAIEmbeddings();
const vectorStore=await MemoryVectorStore.fromDocuments(splitDocs,embeddings);


//Retreice data from vectore store
const retriever=vectorStore.asRetriever({
    k:2,
});


const retrievalChain= createRetrievalChain({
    combineDocsChain:chain,
    retriever,
});

//call chain
const response = await retrievalChain.invoke({
    input: "What is the LCEL?",


});
console.log(response);


