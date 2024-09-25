import { ContactType } from "@/types/screen-settings";


const sleep = (n:number)=> {
    return new Promise((resolve) => setTimeout(resolve, n));
  }
  export default sleep;

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
  return arrObj;
};
  export const isEmailValid = (st: string) => {
    const emailRegex = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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