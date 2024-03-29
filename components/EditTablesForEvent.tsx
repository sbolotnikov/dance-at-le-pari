import ShowIcon from './svg/showIcon';

type Props = {
  tables: number[] | null | undefined;
  onReturn: (str: string, n: number) => void;
};

const EditTablesForEvent = ({ tables, onReturn }: Props) => {
  return (
    <div className="w-full h-full p-1">
      {tables?.length != undefined && tables?.length > 0 && (
        <div className="w-full h-28 relative   overflow-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
          <div className="absolute top-0 left-0  min-w-full  flex flex-wrap items-start justify-start ">
            {tables != null &&
              tables.length > 0 &&
              tables.map((item, index) => (
                <div
                  key={'table_' + index}
                  className="m-1 mr-4 flex flex-col items-center justify-center"
                >
                  <div className="relative h-8 w-8 md:h-10 md:w-10">
                    <div
                      className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                      onClick={(e) => {
                        e.preventDefault();
                        onReturn('Edit', index);
                      }}
                    >
                      <ShowIcon icon={'Table'} stroke={'0.05'} />
                    </div>
                    <span className=" outline-none border-none text-white dark:text-lightMainColor   rounded-md  absolute -top-[0.1rem] left-0 w-full  text-center">
                      {index < 12 ? index + 1 : index + 2}
                    </span>

                    <button
                      className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor absolute p-1 -top-1 -right-9 w-10 h-10"
                      onClick={(e) => {
                        e.preventDefault();
                        onReturn('Delete', index);
                        return;
                      }}
                    >
                      <ShowIcon icon={'Close'} stroke={'2'} />
                    </button>
                  </div>

                  <h2 className="w-full text-center">
                    {item.toString() + ' seats'}
                  </h2>
                </div>
              ))}
            <div className="m-1 mr-4 flex flex-col items-center justify-center">
              <div
                className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer  relative fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                onClick={(e) => {
                  e.preventDefault();
                  onReturn('Add', 0);
                }}
              >
                <ShowIcon icon={'Plus'} stroke={'2'} />
              </div>
              <h2 className="max-w-[100px] text-center">Add Table</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EditTablesForEvent;
