import React, { useState, useRef, useEffect } from 'react';

const AddTravel = ({ travels, setTravels }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTravel, setNewTravel] = useState({
    flightNumber: '',
    from: '',
    to: '',
    startDate: '',
    endDate: '',
    seats: '',
    seatsLeft: '',
    image: '',
    description: '',
  });

  const addModalRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (addModalRef.current && !addModalRef.current.contains(event.target)) {
      setAddModalOpen(false);
    }
  };

  useEffect(() => {
    if (addModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [addModalOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTravel({ ...newTravel, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewTravel({ ...newTravel, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTravel = () => {
    const updatedTravels = [
      ...travels,
      { ...newTravel, seatsLeft: newTravel.seats, isActive: true },
    ];
    setTravels(updatedTravels);
    setAddModalOpen(false);
    setNewTravel({
      flightNumber: '',
      from: '',
      to: '',
      startDate: '',
      endDate: '',
      seats: '',
      seatsLeft: '',
      image: '',
      description: '',
    });
  };

  return (
    <>
      <div className="flex justify-end px-4">
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center justify-center rounded-full"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_162_884)">
              <path
                d="M27.5 22.5V12.5H22.5V22.5H12.5V27.5H22.5V37.5H27.5V27.5H37.5V22.5H27.5ZM25 50C18.3696 50 12.0107 47.3661 7.32233 42.6777C2.63392 37.9893 0 31.6304 0 25C0 18.3696 2.63392 12.0107 7.32233 7.32233C12.0107 2.63392 18.3696 0 25 0C31.6304 0 37.9893 2.63392 42.6777 7.32233C47.3661 12.0107 50 18.3696 50 25C50 31.6304 47.3661 37.9893 42.6777 42.6777C37.9893 47.3661 31.6304 50 25 50Z"
                fill="#1B4348"
              />
            </g>
            <defs>
              <clipPath id="clip0_162_884">
                <rect width="50" height="50" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      {/* Add Travel Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div
            ref={addModalRef}
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
            <h3 className="text-lg font-bold">اضافة رحلة جديدة</h3>
            <form className="mt-4 space-y-4">
              <div>
                <label>رقم الرحلة</label>
                <input
                  type="text"
                  name="flightNumber"
                  value={newTravel.flightNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>من</label>
                <input
                  type="text"
                  name="from"
                  value={newTravel.from}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>الى</label>
                <input
                  type="text"
                  name="to"
                  value={newTravel.to}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>تاريخ المغادرة</label>
                <input
                  type="date"
                  name="startDate"
                  value={newTravel.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>تاريخ العودة</label>
                <input
                  type="date"
                  name="endDate"
                  value={newTravel.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label>الوصف</label>
                <textarea
                  name="description"
                  value={newTravel.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label>الصورة</label>
                <input type="file" onChange={handleImageChange} className="w-full" />
                {newTravel.image && (
                  <img
                    src={newTravel.image}
                    alt="Preview"
                    className="mt-2 w-full h-40 object-cover rounded"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  الغاء
                </button>
                <button
                  type="button"
                  onClick={handleAddTravel}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  اضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTravel;
