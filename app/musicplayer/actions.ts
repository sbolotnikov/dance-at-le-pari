'use server';

// import { makeChainDJ } from '@/utils/makechain';
import { BaseMessage } from '@langchain/core/messages';
import { CartesiaClient } from "@cartesia/cartesia-js";

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
 

import process from "node:process";

interface PlaylistSong {
  name: string;
  dance: string | null;
}

interface Party {
  name: string;
  id: string;
}

export async function generateIntroduction(  
  playlist: PlaylistSong[], 
  choosenParty:  string | null
) {
 
  let introductionArray: string[] = [];
  let introArray: BaseMessage[] = [];
  for (
    let autoPlayIndex1 = 0;
    autoPlayIndex1 < playlist.length;
    autoPlayIndex1++
  ) {
      if (playlist[autoPlayIndex1].dance!=="" && playlist[autoPlayIndex1].name!=="")
      {
      const intro1 = await makeChainDJ(
        introArray,
        'Party theme:' + (choosenParty ? choosenParty : 'no party theme'),
        'introduce Dance: ' +
          playlist[autoPlayIndex1].dance, (autoPlayIndex1 === playlist.length - 1)? true:false
      );
//+ playlist[autoPlayIndex1].name,
      introArray = [
        ...introArray,
        [
          'human',
          'Dance: ' +
          playlist[autoPlayIndex1].dance +
          ' - ' 
        ] as unknown as BaseMessage,
        ['system', intro1] as unknown as BaseMessage,
      ];
      introductionArray = [...introductionArray, intro1];
      }else introductionArray = [...introductionArray, ""]; 
  
  }
  return introductionArray;
}


export async function speak(  
   text: string
) {
 
// Set up the client.
const client = new CartesiaClient({
  apiKey: process.env.CARTESIA_API_KEY,
});
// Make the API call.
const response = await client.tts.bytes({
  modelId: "sonic-2",
  voice: {
    mode: "id",
    id: "87748186-23bb-4158-a1eb-332911b0b708",
  },
  outputFormat: {
    container: "mp3",
    bitRate: 128000,
    sampleRate: 44100,
  },
  transcript: text,
});

// Convert the response to a Buffer and then to a base64 string.
// This is to ensure the data is serializable when passing from server to client components.
const buffer = Buffer.from(response);
return buffer.toString('base64');
}

//Cathy - Coworker e8e5fffb-252c-436d-b842-8879b84445b6
//regular party !! Zack - Sportsman ed81fd13-2016-4a49-8fe3-c0d2761695fc
//Jake - Sidekick 729651dc-c6c3-4ee5-97fa-350da1f88600
//Alaric - Wizard 87748186-23bb-4158-a1eb-332911b0b708

const cache = new Map<string, any>();

export const makeChainDJ = async (chat_history: BaseMessage[],addToSystemPrompt:string, input: string, lastPrompt:boolean) => {
  const cacheKey = JSON.stringify({ chat_history, addToSystemPrompt, input });

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const llm = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-1106',
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
  });
//song and artist and dance name. Some times name has extra words and numbers. Do not use them. You need to come up with introduction to dance, song and mention song following
  const djSystemPrompt = `
You are a DJ at a dance party. Your name is DJ LePari.
You are playing music and interacting with the crowd.
You should be energetic, and fun. Your first message should be an introduction of yourself and welcome message to the party. 
If you know theme of the party, mention it, also you should refer to party theme thru out all party messages, but in creative and engaging ways. Do not repeate theme name often. You can mention the venue (Dance At Le Pari) in interesting funny not repeatitive ways and NOT every response. Use play of words.
Keep your responses short and engaging. Do not to repeat yourself and use different and creative ways to vary the beginning of your messages. Check the chat history to avoid repeating yourself.
You would be provided the name of the dance introduce it in funny creative DJ ways linked to theme if possible. 
You can also talk about dancing and party theme.Write with pauses and emotions in [], like a real DJ would do.
Make sure to keep the energy high and the crowd engaged.
Use exclamations, and fun phrases to keep the mood lively.
Your responses should be suitable for a live dance party atmosphere.
Remember to keep it fun, light-hearted, and engaging for all attendees.
`+addToSystemPrompt;
  const inputPrompt = input+(lastPrompt?"Last dance. greet people wish them goodnight":"");
  const djPrompt = ChatPromptTemplate.fromMessages([
    ["system", djSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{inputPrompt}"],
  ]);

  const chain = djPrompt.pipe(llm);

  const response = await chain.invoke({
    chat_history,
    inputPrompt,
  });

  cache.set(cacheKey, response.content);


  return response.content;
};



 

