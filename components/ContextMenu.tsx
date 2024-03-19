

type Props = {
  items: {title:string, icon:string | undefined}[];
  anchorPoint: { x: number; y: number };
  contextMenuRef: React.RefObject<HTMLDivElement>;
  isShown: boolean;
  onChoice: (item: string) => void;
};

const ContextMenu = ({ items,anchorPoint,contextMenuRef,isShown, onChoice }:Props) => {

 

  return (
    <div ref={contextMenuRef}  className={`h-auto w-auto bg-slate-100 rounded-md shadow-md absolute z-[1000] ${!isShown && 'hidden'}`}
    style={{top: anchorPoint.y + 'px', left: anchorPoint.x + 'px'}}>
    <ul
     
    >
      {items.map((item) => (
        <li key={item.title} onClick={(e) =>{e.preventDefault(); onChoice(item.title)}}>{item.title}</li>
      ))}
    </ul>
    </div>
  );
};

export { ContextMenu };