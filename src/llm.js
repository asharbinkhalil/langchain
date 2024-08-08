import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import * as dotenv from "dotenv";
dotenv.config();
const model = new ChatFireworks(
    {
       
        temperature:0.7,
        maxTokens: 100,
        verbose: true
    }
);

const invokeResponse = await model.invoke("Hello");
console.log("Invoke response:", invokeResponse);
