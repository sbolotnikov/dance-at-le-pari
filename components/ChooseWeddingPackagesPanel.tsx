import { TPaymentType } from '@/types/screen-settings';
import React, { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';

type Props = {
    specialPackage:number,
    selectedWeddingPackages:number[],
    loadingState:(state:boolean)=>void,
};

const ChooseWeddingPackagesPanel = ({specialPackage, selectedWeddingPackages, loadingState}: Props) => {
  const [products, setProducts] = useState<TPaymentType[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>(selectedWeddingPackages);
  const [specialProduct, setSpecialProduct] = useState<number>(specialPackage);
  useEffect(() => {
    fetch('/api/get_products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let prodArr = [];
        prodArr = data.products.filter(
          (product: any) => product.eventtype == 'Private'
        );
        prodArr.sort((a: any, b: any) => {
          if (a.id > b.id) return 1;
          else if (a.id < b.id) return -1;
          else return 0;
        });
        console.log(prodArr);
        setProducts(prodArr);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedWeddingPackages]);
  return (
    <div className="absolute top-0 left-0 w-full min-h-full  flex flex-col justify-center items-center">
      {products.map((product: TPaymentType, index) => (
        <div
          key={'package' + product.id}
          className="w-[95%] flex flex-row flex-wrap bg-lightMainBG dark:bg-darkMainBG m-1 rounded-md p-1 border border-lightMainColor dark:border-darkMainColor"
        >
          <div className="w-3/4 p-1">
            {index + 1}. <span>{product.tag} Price:</span>
            <span>
              $
              {product.options && product.options[0]
                ? product.options[0].price
                : 'N/A'}
            </span>
          </div>
          <div className="w-[12.5%] flex justify-center items-center flex-wrap text-center">
            <div
              className={` h-8 w-8 md:h-10 md:w-10 fill-${
                selectedProducts.indexOf(product.id!) > -1
                  ? 'editcolor'
                  : 'alertcolor'
              }  stroke-${
                selectedProducts.indexOf(product.id!) > -1
                  ? 'editcolor'
                  : 'alertcolor'
              }`}
              onClick={() => {
                let temp = [...selectedProducts];
                if (selectedProducts.indexOf(product.id!) > -1) {
                  temp = temp.filter(
                    (n, i) => i !== selectedProducts.indexOf(product.id!)
                  );
                  if (specialPackage==product.id!)setSpecialProduct(-1);
                } else temp.push(product.id!);
                console.log(temp);
                setSelectedProducts(temp);
              }}
            >
              <ShowIcon
                icon={
                  selectedProducts.indexOf(product.id!) > -1
                    ? 'Checkmark'
                    : 'Close'
                }
                stroke={'0.5'}
              />
            </div>
          </div>
          {selectedProducts.indexOf(product.id!) > -1 && (
            <div className="w-[12.5%] flex justify-center items-center flex-wrap text-center">
              <div
                className={` h-8 w-8 md:h-10 md:w-10 fill-${
                  specialProduct == product.id! ? 'editcolor' : 'alertcolor'
                }  stroke-${
                  specialProduct == product.id! ? 'editcolor' : 'alertcolor'
                }`}
                onClick={() => {
                  setSpecialProduct(product.id!);
                }}
              >
                <ShowIcon
                  icon={specialProduct == product.id! ? 'Checkmark' : 'Close'}
                  stroke={'0.5'}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {(selectedProducts.length !== 0)&&(specialProduct!==-1)&&<button
                      className="btnFancy dark:text-[#93c5fd] dark:border-blue-300 dark:hover:text-white"
                      onClick={async () => {
                        loadingState(true);
                        const res = await fetch('/api/admin/update_wedding_packages', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            specialPackage:specialProduct, weddingPackages: selectedProducts, 
                          }),
                        });
                        loadingState(false);
                      }}
                    >
                      Save
                    </button>}
    </div>
  );
};

export default ChooseWeddingPackagesPanel;
