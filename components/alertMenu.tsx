'use client'
import { useEffect, useState } from "react"
// color schemas for different occasions 
var variant = {
  'danger': {
    'color': '#721c24',
    'backgroundColor': '#f8d7da',
    'borderColor': '#f5c6cb'
    
  },
  'success': {
    'color': '#155724',
    'backgroundColor': '#d4edda',
    'borderColor': '#c3e6cb'
   },
   'secondary': {
    'color': '#383d41',
    'backgroundColor': '#e2e3e5',
    'borderColor': '#d6d8db'
  },
  'warning': {
    'color': '#856404',
    'backgroundColor': '#fff3cd',
    'borderColor': '#ffeeba'
  },
  'info': {
    'color': '#0c5460',
    'backgroundColor': '#d1ecf1',
    'borderColor': '#bee5eb',
  },
  '': {},
}
type AlertType = {
  styling:{
variantHead: string,
heading: string,
text: string,
color1: string,
button1: string,
color2: string,
button2: string,
inputField:string,
},
onReturn: (val: string, val2:string | null ) => void}

export default function AlertMenu(props:AlertType) {
  // main popup alert component
  // DO NOT FORGET TO NAME main tag id="mainPage"

  const el = document.querySelector('#mainPage');
  const [button1Color, setbutton1Color]=useState({'color': "", 'backgroundColor': '','borderColor': ''});
  const [button2Color, setbutton2Color]=useState({'color': "", 'backgroundColor': '','borderColor': ''});
  const [value, setValue] = useState("");

  function StopScroll(){
    // prevent scrolling
    var x=0;
    var y=el!.scrollTop;
    window.onscroll=function(){window.scrollTo(x, y);};
       
}
function AllowScroll(){
  // when done release scroll
  window.onscroll=function(){};
}
const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
           e.preventDefault();
           console.log(e.target.value)
           setValue(e.target.value);
        }
  useEffect(() => {
    // setup buttons style on load 
    setbutton1Color(Object.values(variant)[(Object.keys(variant)as (keyof typeof variant)[] as string[]).indexOf(props.styling.color1)] as {'color': string, 'backgroundColor': string,'borderColor': string} );
    setbutton2Color(Object.values(variant)[(Object.keys(variant)as (keyof typeof variant)[] as string[]).indexOf(props.styling.color2)] as {'color': string, 'backgroundColor': string,'borderColor': string});
    StopScroll();
}, []);
  return (

    <div className="w-[100vw] h-[100svh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md" style={{ top: el!.scrollTop }} >
      <div className='m-auto  max-w-[600px] bg-gray-200 border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly'>
        <label className='px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center' style={Object.values(variant)[Object.keys(variant).indexOf(props.styling.variantHead)]}>{props.styling.heading}</label>
        <h5 className="px-1 py-2 border-2 border-solid border-transparent text-light rounded-sm w-full m-1 text-center"  dangerouslySetInnerHTML={{ __html:props.styling.text}}/>
        {props.styling.inputField=="true" && <textarea id="inputField" className="w-full mb-2 rounded-md text-gray-700" 
        onChange={handleChange}/>}
        {(props.styling.color1!=="") && 
        <button className='px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center text-white' style={button1Color} 
        onClick={() => {
          AllowScroll();
          const input = document.querySelector("#inputField") as HTMLInputElement | null;
          props.onReturn(props.styling.button1, (input != null)?input.value:null) 
          }}>
          {props.styling.button1}
        </button>}
        {(props.styling.color2!=="") &&<button className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center text-white" style={button2Color} onClick={e => {AllowScroll(); props.onReturn(props.styling.button2, null) }}>
          {props.styling.button2}
        </button>}

      </div>

    </div>

  )
}