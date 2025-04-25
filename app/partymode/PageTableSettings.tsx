import ShowIcon from '@/components/svg/showIcon';
import React from 'react';

type Props = {
  tablePages: { name: string; tableRows: string[]; rowsPictures:string[] | undefined; rowsChecked: boolean[] }[];
  onTablePageChange: (
    tablePage: { name: string; tableRows: string[]; rowsPictures: string[] | undefined; rowsChecked: boolean[] }[]
  ) => void;
};

const PageTableSettings = ({ tablePages, onTablePageChange }: Props) => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex w-full flex-col justify-center items-center">
        <div>
          {tablePages &&
            tablePages.map((page, ind) => {
              return (
                <div
                  key={`tablePage${ind}`}
                  className=" w-full flex flex-col justify-center items-center rounded-md border border-lightMainColor dark:border-darkMainColor my-1"
                >
                  <div className="w-full m-1 flex flex-row justify-center items-center">
                    <input
                      type="text"
                      className="w-64 m-1"
                      defaultValue={page.name}
                      onBlur={(e) => {
                        e.preventDefault();
                        let rowsArr = tablePages;
                        rowsArr[ind].name = e.target.value;
                        onTablePageChange(rowsArr);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        let rowsArr = tablePages;
                        rowsArr.splice(ind, 1);
                        onTablePageChange(rowsArr);
                      }}
                      className="  fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8 mt-2 hover:scale-110 transition-all duration-150 ease-in-out"
                    >
                      <ShowIcon icon={'Close'} stroke={'2'} />
                    </button>
                  </div>
                  {page.tableRows &&
                    page.tableRows.map((rowText, index) => {
                      return (
                        <div
                          key={`rowTable${ind}${index}`}
                          className="m-1 w-full flex flex-row justify-center items-center"
                        >
                          {`${index + 1}.`}
                          <input
                            type="checkbox"
                            checked={page.rowsChecked[index]}
                            onChange={(e) => {
                              e.preventDefault();
                              let checkedArr = page.rowsChecked;
                              checkedArr[index] = e.target.checked;
                              let pagesArr = tablePages;
                              pagesArr[ind].rowsChecked = checkedArr;
                              onTablePageChange(pagesArr);
                            }}
                            className="m-1"
                          />
                          <div className="w-64 flex flex-col fill-lightMainColor dark:fill-darkMainColor">
                          <input
                            type="text"
                            className="w-64 m-1"
                            defaultValue={rowText}
                            onBlur={(e) => {
                              e.preventDefault();
                              let rowsArr = page.tableRows;
                              rowsArr[index] = e.target.value;
                              let pagesArr = tablePages;
                              pagesArr[ind].tableRows = rowsArr;
                              onTablePageChange(pagesArr);
                            }}
                          />
                           <input
                            type="text"
                            className="w-64 m-1"
                            defaultValue={page.rowsPictures ? page.rowsPictures[index] : ''}
                            onBlur={(e) => {
                              e.preventDefault();
                              let picsArr = page.rowsPictures? page.rowsPictures : page.tableRows.map(() => "");
                              picsArr[index] = e.target.value;
                              let pagesArr = tablePages;
                              pagesArr[ind].rowsPictures = picsArr;
                              onTablePageChange(pagesArr);
                            }}
                          />
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              let rowsArr = page.tableRows;
                              rowsArr.splice(index, 1);
                              let checkedArr = page.rowsChecked;
                              checkedArr.splice(index, 1);
                              let pagesArr = tablePages;
                              pagesArr[ind].tableRows = rowsArr;
                              pagesArr[ind].rowsChecked = checkedArr;
                              onTablePageChange(pagesArr);
                            }}
                            className="  fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8 mt-2 hover:scale-110 transition-all duration-150 ease-in-out"
                          >
                            <ShowIcon icon={'Close'} stroke={'2'} />
                          </button>
                        </div>
                      );
                    })}

                  <button
                    className="btnFancy cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      let pagesArr = tablePages;
                      pagesArr[ind].tableRows = [...page.tableRows, ''];
                      pagesArr[ind].rowsChecked = [...page.rowsChecked, false];
                      onTablePageChange(pagesArr);
                    }}
                  >
                    <p className="text-center italic">Add Row</p>
                  </button>
                </div>
              );
            })}
        </div>
        <button
          className="btnFancy cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            console.log(tablePages);
            tablePages
              ? onTablePageChange([
                  ...tablePages,
                  { name: '', tableRows: [''], rowsPictures: [""], rowsChecked: [false] },
                ])
              : onTablePageChange([
                  { name: '', tableRows: [''],rowsPictures: [""], rowsChecked: [false] },
                ]);
          }}
        >
          <p className="text-center italic">Add Page</p>
        </button>
      </div>
    </div>
  );
};

export default PageTableSettings;
