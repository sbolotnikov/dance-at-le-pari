// import { OpenAI } from 'langchain/llms/openai';
// import { PineconeStore } from '@pinecone-database/pinecone-client';
// import { ConversationalRetrievalQAChain } from 'langchain/chains';

// const CONDENSE_PROMPT = `Given the chat history and a follow-up question, rephrase the follow-up question to be a standalone question that encompasses all necessary context from the chat history.

// Chat History:
// {chat_history}

// Follow-up input: {question}

// Make sure your standalone question is self-contained, clear, and specific. Rephrased standalone question:`;

// --------------------------------------------------

// const QA_PROMPT = `You are an intelligent AI assistant designed to interpret and answer questions and instructions based on specific provided documents. The context from these documents has been processed and made accessible to you. 

// Your mission is to generate answers that are accurate, succinct, and comprehensive, drawing upon the information contained in the context of the documents. If the answer isn't readily found in the documents, you should make use of your training data and understood context to infer and provide the most plausible response.

// You are also capable of evaluating, comparing and providing opinions based on the content of these documents. Hence, if asked to compare or analyze the documents, use your AI understanding to deliver an insightful response.

// If the query isn't related to the document context, kindly inform the user that your primary task is to answer questions specifically related to the document context.

// Here is the context from the documents:

// Context: {context}

// Here is the user's question:

// Question: {question}

// Provide your response in markdown format.`;

// Creates a ConversationalRetrievalQAChain object that uses an OpenAI model and a PineconeStore vectorstore
// export const makeChain = (
//   vectorstore: PineconeStore,
//   returnSourceDocuments: boolean,
//   modelTemperature: number,
//   openAIapiKey: string,
// ) => {
//   const model = new OpenAI({
//     temperature: modelTemperature, // increase temepreature to get more creative answers
//     modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
//     openAIApiKey: openAIapiKey,
//   });

  // Configures the chain to use the QA_PROMPT and CONDENSE_PROMPT prompts and to not return the source documents

//   const chain = ConversationalRetrievalQAChain.fromLLM(
//     model,
//     vectorstore.asRetriever(),
//     {
//       qaTemplate: QA_PROMPT,
//       questionGeneratorTemplate: CONDENSE_PROMPT,
//       returnSourceDocuments,
//     },
//   );
//   return chain;
// };

 
import { OpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import { BaseMessage } from "@langchain/core/messages";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
 

import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from "@pinecone-database/pinecone";
 




export const  makeChain = async(chat_history: BaseMessage[], input: string) =>{
// Load and process the document
const llm = new OpenAI({
    temperature: 0.9, // increase temepreature to get more creative answers
    modelName: 'gpt-3.5-turbo-1106', //change this to gpt-4 if you have access
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
const fetchResponse = await fetch('/knowledgebase.txt');
const text = await fetchResponse.text();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1536,
  chunkOverlap: 200,
});
 

const documents = await splitter.createDocuments([text]);
 
const pineconeIndex = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!, 
}).Index(process.env.PINECONE_INDEX!);

 ;

 
  
// Create the vector store
const vectorstore = await PineconeStore.fromDocuments(documents, new OpenAIEmbeddings(), {
  pineconeIndex,
});




// const embeddings = new OpenAIEmbeddings({
//   openAIApiKey: process.env.OPENAI_API_KEY,
// });

// const vectorstore = await MemoryVectorStore.fromDocuments(
//     documents,
//     embeddings
//   );
 
  const retriever = vectorstore.asRetriever();

 
 


// Contextualize question
const contextualizeQSystemPrompt = `
Given a chat history and the latest user question
which might reference context in the chat history,
formulate a standalone question which can be understood
without the chat history. Do NOT answer the question, just
reformulate it if needed and otherwise return it as is.`;
const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
  ["system", contextualizeQSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);
const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: contextualizeQPrompt,
  });
  
  // Answer question
  const qaSystemPrompt = `
You are an assistant for question-answering tasks. Use
the following pieces of retrieved context to answer the
question. If you don't know the answer, just say that you
don't know. Use three sentences maximum and keep the answer
concise.
\n\n
{context}`;
const qaPrompt = ChatPromptTemplate.fromMessages([
  ["system", qaSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);
// Below we use createStuffDocuments_chain to feed all retrieved context
// into the LLM. Note that we can also use StuffDocumentsChain and other
// instances of BaseCombineDocumentsChain.
const questionAnswerChain = await createStuffDocumentsChain({
    llm,
    prompt: qaPrompt,
  });
  
  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });
     



// Usage: 
const response = await ragChain.invoke({
  chat_history,
  input
});  
return response;

}