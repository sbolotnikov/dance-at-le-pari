import { MouseEventHandler, useState } from "react";


type Props = {
    options: {
    question: string;
    answer: string;
  }[];
}

export default function Accordion({options}: Props){
    const [visible, setVisible] = useState(-1);
    return (
        <div className='relative m-8'>

        {options.map((item, j) => {
          return (
            <div className="m-3" key={"option" + j} id={j+'.links'} onClick={(e) => {
                e.preventDefault();
                let n = parseInt(e.currentTarget.id);
        
                if (visible>-1){ 
                    document.getElementById("img."+visible)!.classList.remove("rotate-180");
                    document.getElementById("question"+visible)!.classList.remove("text-darkAccent","font-extrabold","uppercase");
                }
                if (n!==visible){
                document.getElementById("img."+n)!.classList.add("rotate-180");
                document.getElementById("question"+n)!.classList.add("text-darkAccent","font-extrabold","uppercase");
                } 
                n!==visible?setVisible(n):setVisible(-1);
            }} >
              <div key={"question" + j} className="w-full flex">
                  <img className="w-5 h-5 transition duration-300 ease-in-out" src={"/icons/caret.svg"}  alt="open" id={"img."+j} key={"btnflip" + j}  />
                
                <h3 id={"question"+j} className="cursor-pointer text-left ml-4">{item.question}</h3>
                
              </div>
             
              <p className={`overflow-hidden transition duration-600 ease-in-out ${(j===visible)?'':'h-0'}`} key={"answer" + j} style={{ cursor: "pointer" }}
                    dangerouslySetInnerHTML={{ __html:item.answer}}/>
              
            </div>
          )
        }
        )}
      </div>
    )
}
