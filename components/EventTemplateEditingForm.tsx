'use client';
import { useEffect, useRef, useState } from 'react';
import ImgFromDb from './ImgFromDb';
import ShowIcon from './svg/showIcon';
import ChoosePicture from './ChoosePicture';
import AlertMenu from './alertMenu';
import ChooseTeacher from './ChooseTeacher';
import { TTeacherInfo } from '@/types/screen-settings';

type Props = {
  template: number | undefined;
  onReturn: () => void;
};

const EventTemplateEditingForm = ({ onReturn, template }: Props) => {
  const [eventtype, setEventType] = useState('Group');
  const [location, setEventTypeLocation] = useState('Main ballroom');
  const [description, setDescription] = useState('');
  const [revealCloud, setRevealCloud] = useState(false);
  const [revealCloud2, setRevealCloud2] = useState(false);
  const [image, setImage] = useState('');
  const [teacher, setTeacher] = useState<TTeacherInfo | null>();
  const [loading, setLoading] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
  const [length1, setLength] = useState(0);
  const [price, setPrice] = useState(0.0);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [visible, setVisible] = useState(false);
  const [alertStyle, setAlertStyle] = useState({
    variantHead: '',
    heading: '',
    text: ``,
    color1: '',
    button1: '',
    color2: '',
    button2: '',
    inputField: '',
  });

  // const refreshTemplates = () => {
  //   fetch('/api/admin/get_event_template', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //     });
  // };
  useEffect(() => {
    if (template !== undefined && template > -1) {
      fetch('/api/admin/get_event_template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: template,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setEventType(data.template.eventtype);
          setDescription(data.template.description);
          setEventTypeLocation(data.template.location);
          setImage(data.template.image);
          console.log(data.template.price);
          setLength(data.template.length);
          setPrice(data.template.price);
          setTitle(data.template.title);
          setTag(data.template.tag);
          setVisible(data.template.visible);
          if (data.template.teachersid.length > 0) {
            fetch('/api/admin/get_teacher_by_id', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: data.template.teachersid[0],
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                setTeacher(data);
              });
          }
        });
    }
  }, []);
  const onReturnPicture = (decision1: string, fileLink: string) => {
    setRevealCloud(false);
    if (decision1 == 'Close') {
      console.log(decision1);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);
      setImage(fileLink);
    }
  };
  const onReturnTeacher = (
    decision1: string,
    fileLink: TTeacherInfo | null
  ) => {
    setRevealCloud2(false);
    if (decision1 == 'Close') {
      setTeacher(null);
      console.log(decision1);
    }
    if (decision1 == 'Confirm') {
      console.log('file link', fileLink);
      setTeacher(fileLink!);
    }
  };
  const onReturnAlert = async (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Return') {
      window.location.reload();
    }
  };
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(length1, price, title, tag, description);
    let validationError = '';
    document.querySelector('#length1')!.classList.remove('invalid_input');
    document.querySelector('#price')!.classList.remove('invalid_input');
    document.querySelector('#title')!.classList.remove('invalid_input');
    document.querySelector('#tag')!.classList.remove('invalid_input');
    document.querySelector('#description')!.classList.remove('invalid_input');
    // submitting profile updated information
    if (length1 < 30 || length1 > 360) {
      validationError = 'Enter length in range 30 min to 6 hours';
      // make name input red
      document.querySelector('#length1')!.classList.add('invalid_input');
    } else if (price < 0 || price > 10000) {
      validationError = 'Enter price in range $0 to $10000';
      // make name input red
      document.querySelector('#price')!.classList.add('invalid_input');
    } else if (tag.length > 30 || tag.length < 2) {
      validationError = 'Enter tag in range of 3 to 30 symbols';
      // make message input red
      document.querySelector('#tag')!.classList.add('invalid_input');
    }
    if (validationError > '') {
      setAlertStyle({
        variantHead: 'danger',
        heading: 'Warning',
        text: validationError,
        color1: 'warning',
        button1: 'Close',
        color2: '',
        button2: '',
        inputField: '',
      });
      setRevealAlert(true);
      return;
    }

    setLoading(true);
    if (template !== undefined && template > -1) {
      fetch('/api/admin/update_event_template', {
        method: 'PUT',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventtype,
          length: length1,
          price,
          image,
          tag,
          title,
          location,
          description,
          visible,
          teachersid:
            teacher !== null && teacher !== undefined ? [teacher?.id] : [],
          id: template,
        }),
      })
        .then(async (res) => {
          setLoading(false);
          setAlertStyle({
            variantHead: 'info',
            heading: 'Message',
            text: 'You successfully  update existing service.',
            color1: 'secondary',
            button1: 'Return',
            color2: '',
            button2: '',
            inputField: '',
          });

          setRevealAlert(true);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    } else
      fetch('/api/admin/create_event_template', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventtype,
          length: length1,
          price,
          image,
          tag,
          title,
          location,
          description,
          visible,
          teachersid:
            teacher !== null && teacher !== undefined ? [teacher?.id] : [],
        }),
      })
        .then(async (res) => {
          setLoading(false);
          setAlertStyle({
            variantHead: 'info',
            heading: 'Message',
            text: 'You successfully  create new template.',
            color1: 'secondary',
            button1: 'Return',
            color2: '',
            button2: '',
            inputField: '',
          });

          setRevealAlert(true);
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  return (
    <>
      {revealCloud && <ChoosePicture onReturn={onReturnPicture} />}
      {revealCloud2 && <ChooseTeacher onReturn={onReturnTeacher} />}
      {revealAlert && (
        <AlertMenu onReturn={onReturnAlert} styling={alertStyle} />
      )}
      <div className="border-0 rounded-md p-1  shadow-2xl w-[90%]  max-w-[450px] md:w-full h-[70vh] md:h-[85%] my-auto bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md ">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor p-1 w-full h-full  flex  justify-center items-center overflow-y-scroll relative ">
          <button
            className=" outline-none border-none cursor-pointer fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-full  absolute p-1 top-2 right-2 w-8 h-8"
            onClick={(e) => {
              e.preventDefault();
              onReturn();
              return;
            }}
          >
            <ShowIcon icon={'Close'} stroke={''} />
          </button>
          <div className="  min-w-full   flex flex-col flex-wrap items-center justify-center absolute top-0 right-0 ">
            <h2
              className="text-center w-full font-bold uppercase mt-2"
              style={{ letterSpacing: '1px' }}
            >
              Activity Editing Form
            </h2>
            <div className="relative flex justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-6 mx-auto">
              {image !== null && image !== '' && image !== undefined ? (
                <ImgFromDb
                  url={image}
                  stylings="object-contain"
                  alt="Event Picture"
                />
              ) : (
                <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                  <ShowIcon icon={'Calendar'} stroke={'2'} />
                </div>
              )}

              <button
                className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
                onClick={(e) => {
                  e.preventDefault();
                  setRevealCloud(!revealCloud);
                  return;
                }}
              >
                <ShowIcon icon={'Exchange'} stroke={''} />
              </button>
            </div>
            <div className="relative flex justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-6 mx-auto">
              {teacher?.image !== null &&
              teacher?.image !== '' &&
              teacher?.image !== undefined ? (
                <div>
                  <ImgFromDb
                    url={teacher?.image!}
                    stylings="object-contain"
                    alt="Event Picture"
                  />
                  <h2 className="text-center">{teacher.name}</h2>
                </div>
              ) : (
                <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                  <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                </div>
              )}

              <button
                className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
                onClick={(e) => {
                  e.preventDefault();
                  setRevealCloud2(!revealCloud2);
                  return;
                }}
              >
                <ShowIcon icon={'Exchange'} stroke={''} />
              </button>
            </div>
            <label className="flex flex-row m-auto justify-between items-center">
              Event type
              <select
                className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                value={eventtype}
                onChange={(e) => {
                  setEventType(e.target.value);
                }}
              >
                <option value="Party">Party</option>
                <option value="Group">Group</option>
                <option value="Private">Private</option>
                <option value="Floor_Fee">Floor_Fee</option>
                <option value="Private">Coaching</option>
              </select>
            </label>
            <label className="flex flex-col m-auto justify-between items-center">
              Location
              <select
                className="bg-main-bg mb-2 rounded-md text-ellipsis bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                value={location}
                onChange={(e) => {
                  setEventTypeLocation(e.target.value);
                }}
              >
                <option value="Studio A (Front)">Studio A (Front)</option>
                <option value="Studio B (Back)">Studio B (Back)</option>
                <option value="Main ballroom">Main ballroom</option>
                <option value="Whole studio">Whole studio</option>
              </select>
            </label>

            <form className=" m-auto" onSubmit={handleSubmit}>
              <label className="flex flex-row justify-between items-center mb-1">
                Length in min.
                <input
                  className=" outline-none border-none rounded-md  w-1/2 text-lightMainColor p-0.5 mx-1"
                  id="length1"
                  name="length1"
                  type="number"
                  value={length1}
                  onChange={(e) => {
                    setLength(parseInt(e.target.value));
                  }}
                  required
                />
              </label>
              <label className="flex flex-row justify-between items-center mb-1">
                Price
                <input
                  className=" outline-none border-none rounded-md w-1/2  text-lightMainColor p-0.5 mx-1"
                  id="price"
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(parseFloat(e.target.value));
                  }}
                  required
                />
              </label>
              <label className="flex flex-row justify-between items-center mb-1">
                Title
                <input
                  className=" outline-none border-none rounded-md w-3/4  text-lightMainColor p-0.5 mx-1"
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </label>
              <label className="flex flex-row justify-between items-center mb-1">
                Event Tag
                <input
                  className=" outline-none border-none rounded-md  w-3/4 text-lightMainColor p-0.5 mx-1"
                  id="tag"
                  name="tag"
                  type="text"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}
                  required
                />
              </label>
              <label className="flex flex-row justify-between items-center mb-1">
                Service Visibility
                <input
                  className=" outline-none border-none rounded-md  text-lightMainColor p-0.5 mx-1"
                  id="visible"
                  name="visible"
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => {
                    setVisible(!visible);
                  }}
                />
              </label>
              <label className="flex flex-col justify-between items-start mb-1">
                Description
                <textarea
                  name="description"
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="w-full rounded text-lightteal"
                  placeholder="Event description"
                  rows={4}
                  minLength={5}
                />
              </label>
              <button
                className="btnFancy w-[90%] mb-10"
                type="submit"
                disabled={loading}
              >
                {'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default EventTemplateEditingForm;

// teachersid Int[]
