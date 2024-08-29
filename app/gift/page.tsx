'use client';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useSession } from 'next-auth/react';
import {
  ScreenSettingsContextType,
  TPriceOption,
} from '@/types/screen-settings';
import PriceOptions from '@/components/PriceOptions';
import { SettingsContext } from '@/hooks/useSettings';
import PriceOptionSelect from '@/components/PriceOptionSelect';
import { addItem } from '@/slices/cartSlice';
import { useDispatch } from 'react-redux';
import ChoosePicture from '@/components/ChoosePicture';
import ImgFromDb from '@/components/ImgFromDb';
import SharePostModal from '@/components/SharePostModal';
type Props = {};

const page = (props: Props) => {
  const { data: session } = useSession();
  const { giftCertificates, gsImage } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
  const [img, setImg] = useState<string>('');
  const [revealCloud, setRevealCloud] = useState(false);
  const [priceOptions, setPriceOptions] = useState<TPriceOption[] | null>(null);
  const [choosenOption, setChoosenOption] = useState<number>(0);
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const dispatch = useDispatch();
  //   tag: string;
  //   price: number;
  //   amount: number;
  console.log(giftCertificates);
  useEffect(() => {
    setPriceOptions(giftCertificates);
    setImg(gsImage);
  }, [giftCertificates]);

  const onReturnPicture = (decision1: string, fileLink: string) => {
    if (decision1 == 'Close') {
      // setRevealCloud1(false);
      setRevealCloud(false);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);
      if (revealCloud == true) {
        setRevealCloud(false);
        setImg(fileLink);
      } else {
        setRevealCloud(false);
        console.log('file link', fileLink);
        setImg(fileLink);
      }
    }
  };
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
       <SharePostModal
        title={
          'Page: Gift Certificates | Dance at Le Pari Studio'
        }
        url={process.env.NEXT_PUBLIC_URL + '/gift'}
        quote={`Description: Gift certificates for ballroom dance classes at Dance at le Pari. Perfect for all occasions and skill levels. Choose from group classes, private lessons, or workshops in waltz, tango, foxtrot, and more. \n Click on the link below. \n`}
        hashtag={' giftCertificate    DanceLePariDanceCenter'}
        onReturn={() => setRevealSharingModal(false)}
        visibility={revealSharingModal}
      />
      {revealCloud && <ChoosePicture onReturn={onReturnPicture} />}
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[850px] h-full max-h-[85%]  md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-y-auto">
          <div className=" absolute top-0 left-0 w-full h-fit p-2">
            <h3 className="w-full uppercase font-semibold  xs:text-md sm:text-xl md:text-4xl text-center">
              Gift Certificates
            </h3>
            <div className=" h-20 w-20 md:h-24 md:w-24 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto">
              <ShowIcon icon={'Gift'} stroke={'0.1'} />
            </div>
            <button
              className=" outline-none border-none absolute right-0 top-0  rounded-md  mt-2  w-8 h-8"
              onClick={(e) => {
                e.preventDefault();
                setRevealSharingModal(!revealSharingModal);
                return;
              }}
            >
              <ShowIcon icon={'Share'} stroke={'2'} />
            </button>
            <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto">
              <div className="w-full md:w-1/2  flex flex-col justify-center items-center">
                <div
                  id="icon"
                  className=" h-52 w-52 m-auto fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                >
                  <ShowIcon icon={'Gift2'} stroke={'0.05'} />
                  {/* */}
                </div>
                <PriceOptionSelect
                  options={priceOptions}
                  id={0}
                  onChange={(option: number) => {
                    console.log(option);
                    setChoosenOption(option);
                  }}
                />
                {priceOptions !== null && (
                  <button
                    className=" btnFancy"
                    onClick={() => {
                      const p1 = {
                        id: choosenOption,
                        image: img,
                        eventtype: 'Gift Certificate',
                        price: priceOptions
                          ? priceOptions[choosenOption].price
                          : 0,
                        tag: priceOptions
                          ? priceOptions[choosenOption].tag
                          : '',
                        amount: 1,
                        seat: null,
                        table: null,
                        date: null,
                      };
                      dispatch(addItem(p1));
                    }}
                  >
                    Add To Cart
                  </button>
                )}
                {session && session.user.role == 'Admin' && (
                  <div className="w-24">
                    <div
                      onClick={() => {
                        setRevealCloud(true);
                      }}
                    >
                      {img !== null && img !== '' && img !== undefined ? (
                        <ImgFromDb
                          url={img}
                          stylings="object-contain"
                          alt="Event Picture"
                        />
                      ) : (
                        <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                          <ShowIcon icon={'Template'} stroke={'2'} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {session && session.user.role == 'Admin' && (
                  <div className="flex flex-col justify-between items-center w-full">
                    <PriceOptions
                      options={priceOptions}
                      onChange={(options: TPriceOption[] | null) => {
                        options !== null
                          ? setPriceOptions([...options])
                          : setPriceOptions(null);
                      }}
                    />
                  </div>
                )}
                {session && session.user.role == 'Admin' && (
                  <button
                    className=" btnFancy"
                    onClick={() => {
                      if (priceOptions !== null) {
                        console.log({
                          giftCertificates: JSON.stringify(priceOptions),
                        });

                        fetch('/api/admin/update_gift_certificates', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            giftCertificates: JSON.stringify({
                              priceOptions,
                              img,
                            }),
                          }),
                        })
                          .then((res) => res)
                          .then((res) => {
                            console.log(res.json());
                            alert('Gift certificates updated!');
                          })
                          .catch((err) => {
                            console.error(err);
                            alert('Internal server error');
                          });
                      }
                    }}
                  >
                    Update Options
                  </button>
                )}
              </div>
              <p className="m-1 w-full md:w-1/2 text-justify">
                Give the gift of dance with a Dance at le Pari gift certificate!
                Perfect for any occasion, our gift certificates allow your loved
                ones to experience the joy and elegance of ballroom dancing.
                Whether they're complete beginners or experienced dancers
                looking to refine their skills, recipients can choose from our
                wide range of classes, including waltz, tango, foxtrot, and
                more. <br />
                <br />
                Gift certificates are available in various denominations and can
                be applied to group classes, private lessons, or dance parties.
                Surprise someone special with the opportunity to learn new
                moves, boost their confidence, and have fun in our welcoming
                studio environment. <br />
                <br />A Dance at le Pari gift certificate is more than just a
                present – it's an invitation to a world of rhythm, grace, and
                unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
