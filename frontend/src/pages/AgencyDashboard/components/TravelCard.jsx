import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@nextui-org/react';

const TravelCard = ({ travel }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [image, setImage] = useState(travel.image || '');
  const [description, setDescription] = useState(travel.description || '');
  const deleteModalRef = useRef(null);
  const editModalRef = useRef(null);

  const {
    travelName,
    from,
    destination,
    dates,
    capacity,
    packages,
    isAvailable,
  } = travel;

  const seatsLeft = capacity;
  const startDate = dates?.[0]?.departure
    ? new Date(dates[0].departure).toLocaleDateString()
    : 'N/A';
  const endDate = dates?.[0]?.arrival
    ? new Date(dates[0].arrival).toLocaleDateString()
    : 'N/A';
  const revenue = packages?.reduce((total, pkg) => total + pkg.price, 0) || 0;

  const statusColor = isAvailable ? 'bg-green-500' : 'bg-red-500';

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
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Card shadow className="mb-4 p-4 grid sm:grid-cols-8 gap-4 items-center text-darkGreen">
        <div className="sm:flex sm:justify-center hidden">
          <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
        </div>

        <div className="hidden sm:block font-bold">{travelName}</div>
        <div className="hidden sm:block">{`${from} - ${destination}`}</div>
        <div className="hidden sm:block">{startDate}</div>
        <div className="hidden sm:block">{endDate}</div>
        <div className="hidden sm:block">{`${seatsLeft}/${capacity}`}</div>
        <div className="hidden sm:block">{revenue} ر.س</div>

        <div className="sm:flex sm:gap-2 sm:justify-end hidden sm:block">
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

      {deleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div
            ref={deleteModalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-80 sm:w-full max-h-[80vh] overflow-y-auto"
          >
            <p className="font-bold text-xl text-center">
              هل انت متأكد من حذف هذه الرحلة؟
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                الغاء
              </button>
              <button
                onClick={() => {
                  alert(`Travel "${travelName}" deleted!`);
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

      {editModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div
            ref={editModalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-80 sm:w-full max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-lg font-bold">تعديل بيانات الرحلة</h3>
            <form className="mt-4 space-y-4">
              <div>
                <label>اسم الرحلة</label>
                <input
                  type="text"
                  defaultValue={travelName}
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
                  defaultValue={destination}
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
                <input type="file" onChange={handleImageChange} />
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
