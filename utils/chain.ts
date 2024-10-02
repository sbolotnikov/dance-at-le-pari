import { ChatOpenAI } from "@langchain/openai";
import {pinecone} from "@/utils/pinecone-client";
// import { PineconeStore } from "langchain/vectorstores";
// import {OpenAIEmbeddings} from "langchain/embeddings/openai";
// import {ConversationalRetrievalQAChain} from "langchain/chains";


const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0
  });
async function initChain() {
    const model = new ChatOpenAI({});

    const pineconeClient = await pinecone;
    // const pineconeIndex = await pineconeClient.Index(process.env.PINECONE_INDEX ?? '');

    /* create vectorstore*/
    // const vectorStore = await PineconeStore.fromExistingIndex(
    //     new OpenAIEmbeddings({}),
    //     {
    //         pineconeIndex: pineconeIndex,
    //         textKey: 'text',
    //     },
    // );

    return 
    // ConversationalRetrievalQAChain.fromLLM(
    //     model,
    //     vectorStore.asRetriever(),
    //     {returnSourceDocuments: true}
    // );
}
export const chain = initChain()