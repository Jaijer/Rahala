import React from 'react';
import { MdCancel, MdCheckCircle } from "react-icons/md";

function RequestItem({ name, id, onAccept, onDelete }) {
  return (
    <div className="flex justify-between items-center flex-grow">
      <span>{name}</span>

      <div className="flex gap-2 items-center">
        <MdCancel
          className='text-4xl text-[#E33629] hover:cursor-pointer hover:opacity-85'
          onClick={onDelete}
        />
        <MdCheckCircle
          className='text-4xl text-darkGreen hover:cursor-pointer hover:opacity-85'
          onClick={onAccept}
        />
      </div>
    </div>
  );
}

export default RequestItem;
