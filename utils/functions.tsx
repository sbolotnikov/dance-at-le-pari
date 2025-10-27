import { ContactType } from "@/types/screen-settings";
import axios from 'axios';


const sleep = (n:number)=> {
    return new Promise((resolve) => setTimeout(resolve, n));
  }
  export default sleep;
export const getEnvLocal =  async (key: string) => {
  try {
  const data = await fetch('/api/admin/get_env', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: key,
    }),
  }) 
  const res = await data.json();
      console.log(res.id)
      return res.id;
    } catch (error) {
      if (error) {
        return error;
      }
  }
}

  export const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  export const getDate = (date: string) => {
    if ((date === '')||(date===undefined)||(date===null)) return null
    // let dateArr = date.split('T');
    // let timeArr = dateArr[1];
    // console.log(date,timeArr);
    // timeArr = timeArr.split('\r')[0];
    // return new Date(dateArr[0]+'T'+timeArr+':00');
    return new Date(date );
  };
export const csvJSON = (text: string, quoteChar: string, delimiter: string) => {
  var rows = text.split('\r\n');
  var headers = rows[0].split(delimiter); 
  var lines = text.split('\r\n');
  lines = lines.slice(1);
  let objContact: { [key: string]: any } = {};
  let arrObj: ContactType[] = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      const value = lines[i].split(delimiter)[j];
      if (key=="id") {
        objContact = {
         ...objContact,
          [key]: parseInt(value),
        };
      } else {
        objContact = {
         ...objContact,
          [key]: value,
        };
      }
      
    }
    objContact.createdAt = getDate(objContact.createdAt as string);
    objContact.lastcontact = getDate(objContact.lastcontact as string);
    if (objContact.email) {
      arrObj.push(objContact as ContactType);
    }
   
  }
  // console.log('csvJSON', arrObj);
  return arrObj;
};
  export const isEmailValid = (st: string) => {
    const emailRegex = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
      'gm'
    );
    return emailRegex.test(st);
  };
export const get_package = async (n:number[])=> {
   return fetch('/api/get_template', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
        body: JSON.stringify({
          arr: n,
        }),
  }).then(async (res) => {
    const data = await res.json();
    console.log(data)
    return data;
}).catch((error) => {
    console.error('Error:', error);
})
  }  

export const save_Template = (text1:string,filename:string) =>{
  var FileSaver = require('file-saver');
var blob = new Blob([text1], {type: "text/plain;charset=utf-8"});
FileSaver.saveAs(blob, filename+".txt");

} 
 
export const save_File = (text1:string,filename:string) =>{
  var FileSaver = require('file-saver');
var blob = new Blob([text1], {type: "text/plain;charset=utf-8"});
FileSaver.saveAs(blob, filename);

}  

export const fetchInstagramPosts = async () => {
  try {
      const response = await axios.get(
          `https://graph.instagram.com/me/media?fields=id,media_url,permalink&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`
      );
      return response.data.data
  } catch (error) {
      console.error('Error fetching Instagram posts', error);
      return []
  }
};

function loadBestVoice(): Promise<SpeechSynthesisVoice | null> {
  return new Promise(resolve => {
    const synth = window.speechSynthesis;

    function selectVoice() {
      const voices = synth.getVoices();

      // Priority 1: Google US English
      const googleUS = voices.find(v => v.name === 'Google US English');
      if (googleUS) return resolve(googleUS);

      // Priority 2: Other Google voices
      const googleAlt = voices.find(v => v.name.includes('Google'));
      if (googleAlt) return resolve(googleAlt);

      // Priority 3: Microsoft voices (Edge/Windows)
      const microsoft = voices.find(v =>
        ['Microsoft Zira', 'Microsoft David', 'Microsoft Mark'].includes(v.name)
      );
      if (microsoft) return resolve(microsoft);

      // Priority 4: Any English voice
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      resolve(englishVoice || null);
    }

    if (synth.getVoices().length) {
      selectVoice();
    } else {
      synth.onvoiceschanged = selectVoice;
    }
  });
}

export const speaking_Func = async (text: string,onEnd: (endF:string) => void) => {
  const voice = await loadBestVoice();
  const utterance = new SpeechSynthesisUtterance(text);

  if (voice) {
    utterance.voice = voice;
    utterance.pitch = 1.1; // Slightly expressive
    utterance.rate = 0.95; // Natural pacing
    utterance.onend = () =>{onEnd('ended')};
  } else {
    console.warn('No suitable voice found.');
  }

  speechSynthesis.speak(utterance);
}