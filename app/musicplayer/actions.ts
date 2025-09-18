'use server';

import { makeChainDJ } from '@/utils/makechain';
import { BaseMessage } from '@langchain/core/messages';
import { CartesiaClient } from "@cartesia/cartesia-js";
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
    
      const intro1 = await makeChainDJ(
        introArray,
        'Party theme:' + (choosenParty ? choosenParty : 'no party theme'),
        'Dance: ' +
          playlist[autoPlayIndex1].dance +
          ' - ' +
          playlist[autoPlayIndex1].name
      );

      introArray = [
        ...introArray,
        [
          'human',
          'Dance: ' +
          playlist[autoPlayIndex1].dance +
          ' - ' +
          playlist[autoPlayIndex1].name,
        ] as unknown as BaseMessage,
        ['system', intro1] as unknown as BaseMessage,
      ];
      introductionArray = [...introductionArray, intro1];
       
  
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
    id: "ed81fd13-2016-4a49-8fe3-c0d2761695fc",
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
//Zack - Sportsman ed81fd13-2016-4a49-8fe3-c0d2761695fc
//Jake - Sidekick 729651dc-c6c3-4ee5-97fa-350da1f88600
//Alaric - Wizard 87748186-23bb-4158-a1eb-332911b0b708