import React from 'react';
// import { EditIcon, DeleteIcon, CheckCircleIcon } from './icons';
import { TDanceItemType } from '@/types/screen-settings';
import ShowIcon from '@/components/svg/showIcon';

interface DanceItemProps {
  item: TDanceItemType;
  index: number;
  isReorderActive: boolean;
  isSourceOfReorder: boolean;
  onToggleReorder: (index: number) => void;
  onMoveItem: (index: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onItemClick: () => void;
  isCurrent: boolean;
}

const DanceItem: React.FC<DanceItemProps> = ({
  item,
  index,
  isReorderActive,
  isSourceOfReorder,
  onToggleReorder,
  onMoveItem,
  onDelete,
  onEdit,
  onItemClick,
  isCurrent,
}) => {
  return (
    <li
      className={`
        flex items-center ${isCurrent ? 'bg-blue-300' : 'bg-white'} p-3 md:p-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out
        ${isSourceOfReorder ? 'ring-2 ring-blue-500 shadow-lg' : ''}
      `}
    >
      <div className="flex items-center space-x-3 md:space-x-4 flex-grow">
        {isReorderActive ? (
          <button
            onClick={() => onMoveItem(index)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-100 transition-colors"
            title={`Move item to position ${index + 1}`}
            aria-label={`Move item to position ${index + 1}`}
          >
            <div className="  h-8 w-8 rounded-full   p-1 group-hover:animate-bounce stroke-editcolor fill-editcolor  ">
              <ShowIcon icon={'Checkmark'} stroke={'1'} />
            </div>
          </button>
        ) : (
          <button
            onClick={() => onToggleReorder(index)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-500 bg-slate-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Click to change position"
          >
            {index + 1}
          </button>
        )}
        <div className="flex-grow" onClick={onItemClick} style={{ cursor: 'pointer' }}>
          <p className="font-semibold text-slate-800 text-base">
            {item.danceName}
          </p>
          <p className="text-sm text-slate-500">
            {item.songName} -{' '}
            <span className="font-medium">{item.speed}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-3 ml-4">
        <button
          onClick={() => onEdit(item.id)}
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
          aria-label={`Edit ${item.danceName}`}
        >
          <div className="  h-8 w-8 rounded-full   p-1 group-hover:animate-bounce stroke-editcolor fill-editcolor ">
            <ShowIcon icon={'Edit'} stroke={'1'} />
          </div>
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
          aria-label={`Delete ${item.danceName}`}
        >
          <div className="  h-8 w-8  rounded-full   p-1 group-hover:animate-bounce stroke-alertcolor fill-alertcolor ">
                  <ShowIcon icon={'Close'} stroke={'1'} />
                </div>
        </button>
      </div>
    </li>
  );
};

export default DanceItem;
