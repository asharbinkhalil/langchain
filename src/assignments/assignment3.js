import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { loadEvaluator } from "langchain/evaluation";
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



const string_evaluator = async (input,result) => {

    let evaluator = await loadEvaluator("criteria", { criteria: "conciseness" ,'llm': model});
    let res = await evaluator.evaluateStrings({
        input: input,
        prediction:result,
      });
    console.log("-----------------String Evaluator (Conciseness):-----------------");
    console.log("String Evaluator Score: ",res['score']);
    console.log("String Evaluator Feedback: ",res['value']);
    console.log("---------------------------------------------------------------");

    evaluator = await loadEvaluator("labeled_criteria", {
        criteria: "correctness",
        llm: model,
      });

    res = await evaluator.evaluateStrings({
        input: input,
        prediction: result,
        reference:
          "You can get a loan up to a maximum of three times your base monthly salary.",
      });

    console.log("-----------------String Evaluator (Correctness):-----------------");
    console.log("String Evaluator Score: ",res['score']);
    console.log("String Evaluator Feedback: ",res['value']);
    console.log("---------------------------------------------------------------");

}

const embedding_evaluator = async (input,result) => {
    const emb_model = new ChatFireworks({
        temperature: 0.7,
        maxTokens: 100,
        verbose: false,
        model: 'text-embedding-ada-002',

    });
    
    const evaluator = await loadEvaluator({ criteria: "conciseness" ,'llm': emb_model},"embedding_distance" );

    const res = await evaluator.evaluateStrings({
        prediction:"According to Emumba's loan policy, you can apply for an interest-free loan up to a maximum of three times your base monthly salary" ,
        reference: result,
      });
      
    return console.log( res );
}   



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
            console.log(await string_evaluator(input,response));  //string evaluator
            //console.log(await embedding_evaluator(input,response));  //embedding evaluator
            askQuestion();
        });
    };

    askQuestion();
};


startChat();