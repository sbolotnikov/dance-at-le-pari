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

 

export default async function TextToSVGLocal(textLine, fontPath) {
  

  if ( !textLine) {
    
    return;
  }

  // Load the font using opentype.js
  // const font = await opentype.Font.load(fontPath as string);
  // const font = await opentype.load(fontPath as string);
  const font = await opentype.load('fonts/static/DancingScript-Bold.ttf');
  // Create a canvas
  const canvas = createCanvas(800, 200);
  const context = canvas.getContext('2d');

  // Set the font and draw the text
  context.font = '48px DancingScript';
  const text = textLine;
  // console.log(Font.getPath(text, 0, 0, 48))
  const paths = [];

  // Convert each letter to a path
  for (let i = 0; i < text.length; i++) {
    const glyph = font.charToGlyph(text[i]);
    console.log(glyph[i])
    const path = glyph.getPath(i * 25, 100, 48);
    paths.push(path.toSVG());
  }

  // Combine all paths into one SVG
  const svgPaths = paths.join(' ');
  // const svgPaths = font.getPath(text, 0, 100, 48).toSVG();
  const svg = `
    <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
      <g >
        ${svgPaths}
      </g>
    </svg>
  `;
  console.log(svg);
  return svg;
}