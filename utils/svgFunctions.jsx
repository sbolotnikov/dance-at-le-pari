// 'use server'; 
// const {TextToSVG} = require("text-to-svg");
// export async function TextToSVGLocal(text){ 
//     TextToSVG.load('@/fonts/MonsieurLaDoulaise-Regular.ttf', function(err, textToSVG) {
//         const svg = textToSVG.getSVG(text);
//         console.log(svg);
// const svg1 = textToSVG.getSVG(text, {
//     x: 0,
//     y: 0,
//     fontSize: 100,
//     anchor:'middle',
//     attributes: {
//       fill: '#000',
//       'font-size': '100px',
//       'text-anchor':'middle',
//     },
//   });
// console.log(svg1);
// return svg1;
// })}
 
import { createCanvas, registerFont, loadImage } from 'canvas';
import * as opentype from 'opentype.js'; 

function checkCase(character) {
  if (character === 
  character.toUpperCase()) {
      return 'Uppercase';
  } else if (character === 
  character.toLowerCase()) {
      return 'Lowercase';
  } else {
      return 'Mixed case';
  }
}

export async function TextToSVGLocal(textLine, fontPath) {
  

  if ( !textLine) {
    
    return;
  }

  // Load the font using opentype.js
  // const font = await opentype.Font.load(fontPath as string);
  // const font = await opentype.load(fontPath as string);
  const font = await opentype.load('fonts/DancingScriptVariableFont.ttf');
  // Create a canvas
  const canvas = createCanvas(800, 50);
  const context = canvas.getContext('2d');

  // Set the font and draw the text
  context.font = '48px DancingScript';
  const text = textLine;
  // console.log(Font.getPath(text, 0, 0, 48))
  const paths = []; 
  let offset1=0;
  // Convert each letter to a path
  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i]);
    // const svgPathcurrent = font.getPath(text.slice(0,i), 0, 0, 48).toSVG();
    // let bbox = svgPathcurrent.getBoundingClientRect();
    // console.log(bbox.width)
    
     
    const path = glyph.getPath(offset1, 0, 48);
    checkCase(text[i])=="Uppercase"?offset1+=45:offset1+=16;
    paths.push(path.toSVG());
  }

  // Combine all paths into one SVG
  const svgPaths = paths.join(' ');
  // const svgPaths = font.getPath(text, 0, 0, 48).toSVG();
  const svg = `
    <svg   viewBox='0 0 500 50' xmlns="http://www.w3.org/2000/svg">
      <g width='100%' transform="translate(0, 31)">
        ${svgPaths}
      </g>
    </svg>
  `;
  console.log(svg);
  return svg;
}
export async function TextToPathArrayLocal(textLine) {
  

  if ( !textLine) {
    
    return;
  }

  // Load the font using opentype.js
  // const font = await opentype.Font.load(fontPath as string);
  // const font = await opentype.load(fontPath as string);
  const font = await opentype.load('fonts/Lato.ttf');
  // Create a canvas
  const canvas = createCanvas(800, 50);
  const context = canvas.getContext('2d');

  // Set the font and draw the text
  context.font = '48px Lato';
  const text = textLine;
  // console.log(Font.getPath(text, 0, 0, 48))
  
  let pathArray=[]; 
  // Convert each letter to a path
  for (let i = 0; i < text.length; i++) {
     
    const path2 = font.charToGlyph(text[i]).getPath(0, 0, 48).toSVG();
    pathArray.push(path2); 
  }
  
  return pathArray;
}