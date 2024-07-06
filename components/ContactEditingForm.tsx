import { useEffect, useState } from 'react';
import { ContactType } from '@/types/screen-settings';
import ShowIcon from './svg/showIcon';

type Props = {
  contact: ContactType;
  editable: boolean;
  onDelete: (id: number, nameData: string) => void;
  onEdit: (id: number) => void;
  onSubmit: (contact: ContactType) => void;
};
const ContactEditingForm = ({
  contact,
  editable,
  onDelete,
  onEdit,
  onSubmit,
}: Props) => {
  const [contactData, setContactData] = useState<ContactType>(contact);
  const [displayName, setDisplayName] = useState<string>('');
  // const [editable, setEditable] = useState(false)

  const handleDelete = () => {
    let contactStr = displayName + '<' + contactData.email + '>';
    onDelete(contact.id, contactStr);
  };
  useEffect(() => {
    let name = contactData.name !== null ? contactData.name + ' ' : '';
    name += contactData.lastname !== null ? contactData.lastname : '';
    setDisplayName(name);
  }, [contactData.name, contactData.lastname]);
  useEffect(() => {
    let data1 = contact;
    if (contact.name == null) data1.name = '';
    if (contact.lastname == null) data1.lastname = '';
    if (contact.telephone1 == null) data1.telephone1 = '';
    if (contact.telephone2 == null) data1.telephone2 = '';
    setContactData(data1);
  }, []);
  return (
    <div className="w-full relative flex flex-row justify-center items-center flex-wrap mb-10 mx-2">
      {!editable ? (
        <h3 className="w-[80%] flex flex-row justify-between flex-wrap">
          <label className="flex flex-row items-center">
            Name<span className="m-1">{displayName}</span>
          </label>
          <label className="flex flex-row items-center">
            Email<span className="m-1">{contactData.email}</span>
          </label>
          <label className="flex flex-row items-center">
            Main Telephone<span className="m-1">{contactData.telephone1}</span>
          </label>
          <label className="flex flex-row items-center">
            Additional Telephone
            <span className="m-1">{contactData.telephone2}</span>
          </label>
        </h3>
      ) : (
        <div className="w-full flex flex-row justify-between flex-wrap">
          <label className="flex flex-col items-center w-[95%]">
            First Name
            <input
              type="text"
              className="w-full m-1"
              value={contactData.name!}
              onChange={(e) => {
                setContactData({ ...contactData, name: e.target.value });
              }}
            />
          </label>
          <label className="flex flex-col items-center w-[95%]">
            Last Name
            <input
              type="text"
              className="w-full m-1"
              value={contactData.lastname!}
              onChange={(e) => {
                setContactData({ ...contactData, lastname: e.target.value });
              }}
            />
          </label>
          <label className="flex flex-col items-center w-[95%]">
            Email
            <input
              required
              type="email"
              className="w-full m-1"
              value={contactData.email}
              onChange={(e) => {
                setContactData({ ...contactData, email: e.target.value });
              }}
            />
          </label>
          <label className="flex flex-col items-center w-[95%]">
            Main Telephone
            <input
              type="text"
              className="w-full m-1"
              value={contactData.telephone1!}
              onChange={(e) => {
                setContactData({ ...contactData, telephone1: e.target.value });
              }}
            />
          </label>
          <label className="flex flex-col items-center w-[95%]">
            Additional Telephone
            <input
              type="text"
              className="w-full m-1"
              value={contactData.telephone2!}
              onChange={(e) => {
                setContactData({ ...contactData, telephone2: e.target.value });
              }}
            />
          </label>
        </div>
      )}
      <div className={`w-[${!editable ?"20":"100"}%] flex flex-row justify-between items-center flex-wrap`}>
        <button
          className=" p-2 m-2  flex justify-center  items-center"
          onClick={handleDelete}
        >
          <div className=" h-6 w-6 md:h-8 md:w-8 fill-alertcolor stroke-alertcolor ">
            <ShowIcon icon={'Close'} stroke={'2'} />
          </div>
        </button>
        {!editable ? (
          <button
            className=" outline-none border-none fill-editcolor  stroke-editcolor  rounded-md border-editcolor p-2 m-2  h-10 w-10 md:h-12 md:w-12"
            onClick={(e) => {
              e.preventDefault();
              onEdit(contact.id);
            }}
          >
            <ShowIcon icon={'Edit'} stroke={'.5'} />
          </button>
        ) : (
          <button
            className="btnFancy"
            onClick={(e) => {
              e.preventDefault();
              onSubmit(contactData);
            }}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactEditingForm;
