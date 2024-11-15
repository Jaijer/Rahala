import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@nextui-org/react';

const TravelCard = ({ travel }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [image, setImage] = useState(travel.image || '');
  const [description, setDescription] = useState(travel.description || '');
  const deleteModalRef = useRef(null);
  const editModalRef = useRef(null);

  const { from, to, startDate, endDate, seats, seatsLeft, revenue, flightNumber } = travel;

  // Determine the status color
  const statusColor = seatsLeft > 0 ? 'bg-green-500' : 'bg-red-500';

  const handleOutsideClick = (event, ref, closeHandler) => {
    if (ref.current && !ref.current.contains(event.target)) {
      closeHandler();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      handleOutsideClick(event, deleteModalRef, () => setDeleteModalOpen(false));
      handleOutsideClick(event, editModalRef, () => setEditModalOpen(false));
    };

    if (deleteModalOpen || editModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [deleteModalOpen, editModalOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result); // Display the image as a preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Card shadow className="mb-4 p-4 grid grid-cols-8 gap-4 items-center text-darkGreen">
        {/* Status Indicator */}
        <div className="flex justify-center">
          <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
        </div>

        {/* Flight Number */}
        <div>{flightNumber}</div>

        {/* From - To */}
        <div>{`${from} - ${to}`}</div>

        {/* Start Date */}
        <div>{startDate}</div>

        {/* End Date */}
        <div>{endDate}</div>

        {/* Seats Left */}
        <div>{`${seatsLeft}/${seats}`}</div>

        {/* Revenue */}
        <div>{revenue} ر.س</div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          {/* Edit Button */}
          <button onClick={() => setEditModalOpen(true)} className="p-2">
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.25 24.4375V29.75H9.5625L25.2308 14.0817L19.9183 8.76916L4.25 24.4375ZM30.3308 8.98166L25.0183 3.66916L21.4342 7.26749L26.7467 12.58L30.3308 8.98166Z"
                fill="#1B4348"
              />
            </svg>
          </button>

          {/* Delete Button */}
          <button onClick={() => setDeleteModalOpen(true)} className="p-2">
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.50033 30.0833C9.50033 31.825 10.9253 33.25 12.667 33.25H25.3337C27.0753 33.25 28.50033 31.825 28.50033 30.0833V11.0833H9.50033V30.0833ZM30.0837 6.33333H24.542L22.9587 4.75H15.042L13.4587 6.33333H7.91699V9.5H30.0837V6.33333Z"
                fill="#1B4348"
              />
            </svg>
          </button>
        </div>
      </Card>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div
            ref={deleteModalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-80 sm:w-full max-h-[80vh] overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>
              {`
                ::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div className="flex justify-center mb-2">
              <svg
                width="50"
                height="50"
                viewBox="0 0 150 150"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M75 0C116.423 0 150 33.5775 150 75C150 116.423 116.423 150 75 150C33.5775 150 0 116.423 0 75C0 33.5775 33.5775 0 75 0ZM75 15C59.087 15 43.8258 21.3214 32.5736 32.5736C21.3214 43.8258 15 59.087 15 75C15 90.913 21.3214 106.174 32.5736 117.426C43.8258 128.679 59.087 135 75 135C90.913 135 106.174 128.679 117.426 117.426C128.679 106.174 135 90.913 135 75C135 59.087 128.679 43.8258 117.426 32.5736C106.174 21.3214 90.913 15 75 15Z"
                  fill="#E33629"
                />
              </svg>
            </div>
            <p className="font-bold text-xl text-center">هل انت متأكد من حذف هذه الرحلة؟</p>
            <div className="mt-4 flex justify-center gap-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                الغاء
              </button>
              <button
                onClick={() => {
                  alert(`Travel with flight number ${flightNumber} deleted!`);
                  setDeleteModalOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div
            ref={editModalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-80 sm:w-full max-h-[80vh] overflow-y-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>
              {`
                ::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <h3 className="text-lg font-bold">تعديل بيانات الرحلة</h3>
            <form className="mt-4 space-y-4">
              <div>
                <label>رقم الرحلة</label>
                <input
                  type="text"
                  defaultValue={flightNumber}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label>من</label>
                <input
                  type="text"
                  defaultValue={from}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label>الى</label>
                <input
                  type="text"
                  defaultValue={to}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label>تاريخ المغادرة</label>
                <input
                  type="text"
                  defaultValue={startDate}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label>تاريخ العودة</label>
                <input
                  type="text"
                  defaultValue={endDate}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label>الوصف</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label>الصورة</label>
                <input type="file" onChange={handleImageChange} className="w-full" />
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mt-2 w-full h-40 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  الغاء
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TravelCard;
