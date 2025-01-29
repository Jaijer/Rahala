import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Image,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
} from "@nextui-org/react";
import { 
  FaRoute,
  FaCalendarAlt, 
  FaInfoCircle, 
  FaLongArrowAltLeft,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaBuilding,
  FaChevronRight,
  FaUsers
} from "react-icons/fa";
import api from "../../api/axios";
import useTravelStore from "../../stores/travelStore";
import useUserStore from "../../stores/userDataStore";
import AddTravelModal from "../AgencyDashboard/components/AddTravelModal";
import TravelersList from "./TravelersList";
import { getAuth } from 'firebase/auth';

const ViewTravels = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { travel, setTravel } = useTravelStore();
  const { userData } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTravelOwner, setIsTravelOwner] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sortedDates, setSortedDates] = useState();

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const response = await api.get(`/api/travels/${id}`);
        setTravel(response.data);
        setSortedDates(response.data.dates.slice().sort((a, b) => new Date(a.departure) - new Date(b.departure)));
        setIsTravelOwner(
          response.data.agency?._id === userData?._id &&
            response.data.agency?._id
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTravel();
  }, [id, setTravel, userData]);

  const handleDeleteTravel = async () => {
    setDeleteLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
    
      if (!user) {
        console.error('User not authenticated');
        return;
      }
    
      const token = await user.getIdToken();
      await api.delete(`/api/travels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.history.back();
    } catch (error) {
      console.error("Error deleting travel:", error);
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getCapacityColor = (bookedCount, capacity) => {
    const percentage = (bookedCount / capacity) * 100;
    if (percentage < 50) return "success";
    if (percentage < 75) return "warning";
    return "danger";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full flex-grow">
        <Spinner />
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="text-center flex justify-center items-center h-full flex-grow">
        لم يتم العثور على الرحلة
      </div>
    );
  }

  return (
    <div className="font-inter">
      <div className="container mx-auto px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Content Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Agency Info */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4">
                <FaRoute size={24} className="text-[#1B4348] ml-2" />
                {travel.travelName}
              </h2>
              <h2 className="text-xl lg:text-2xl font-bold text-[#757575] flex items-center gap-4">
                <FaBuilding size={20} className="text-[#757575] ml-2" />
                {travel.agency?.name}
              </h2>
            </div>

            {/* Route with Arrow */}
            <div className="flex items-center gap-6 text-2xl lg:text-3xl font-bold text-[#1B4348] py-2">
              <span>{travel.from}</span>
              <FaLongArrowAltLeft size={24} className="text-[#757575] mx-2" />
              <span>{travel.destination}</span>
            </div>

            {/* Description Section */}
            <div className="space-y-4 bg-white/60 border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4">
                <FaInfoCircle size={24} className="text-[#1B4348] ml-2" />
                وصف الرحلة
              </h2>
              <p className="text-lg lg:text-xl text-[#757575] max-w-2xl">
                {travel.description}
              </p>
            </div>

            {/* Dates and Capacity Section */}
            <div className="space-y-4 bg-white/60 border p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348] flex items-center gap-4">
                <FaCalendarAlt size={24} className="text-[#1B4348] ml-2" />
                تواريخ الرحلة والسعة
              </h2>
              <div className="space-y-6">
                {sortedDates.map((date) => (
                  <div key={date._id} className="space-y-2">
                    <div className="flex gap-4 items-center text-lg lg:text-xl text-[#757575]">
                      <span>
                        {new Date(date.departure).toLocaleDateString("ar-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <FaLongArrowAltLeft size={16} className="text-[#757575] mx-2" />
                      <span>
                        {new Date(date.arrival).toLocaleDateString("ar-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    
                    {/* Capacity Information */}
                    <div className="bg-white/80 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-[#757575]">
                        <FaUsers size={16} />
                        <span>السعة المتاحة:</span>
                        <span className="font-semibold">
                          {date.bookedCount} / {date.capacity}
                        </span>
                      </div>
                      <Progress 
                        value={(date.bookedCount / date.capacity) * 100}
                        color={getCapacityColor(date.bookedCount, date.capacity)}
                        className="w-full"
                        size="sm"
                      />
                      <div className="text-sm text-[#757575]">
                        {date.capacity - date.bookedCount} مقعد متبقي
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers Section */}
            {isTravelOwner && <TravelersList travellers={travel.travellers} />}
          </div>

          {/* Image Column */}
          <div className="lg:col-span-4 flex items-start justify-center">
            <div className="w-full max-w-md sticky top-8">
              <Image
                isBlurred
                src={travel.image}
                alt="Travel Image"
                classNames={{
                  wrapper: "flex items-center justify-center",
                  img: "object-cover rounded-xl shadow-lg",
                }}
                radius="lg"
              />
            </div>
          </div>
        </div>

        {/* Buttons Container */}
        <div className="pt-12 flex justify-center items-center gap-6">
          {!isTravelOwner && (
            <Button
              className="font-bold text-lg px-8 bg-greeny"
              variant="solid"
              radius="full"
              size="lg"
              onClick={() => navigate("/book-trip")}
              startContent={<FaChevronRight size={18} />}
            >
              حجز
            </Button>
          )}

          {isTravelOwner && (
            <>
              <Button
                className="font-bold text-lg"
                variant="light"
                color="primary"
                radius="full"
                size="lg"
                onClick={() => setIsEditModalOpen(true)}
                startContent={<FaEdit size={18} />}
              >
                تعديل
              </Button>
              <Button
                className="font-bold text-lg"
                variant="light"
                color="danger"
                radius="full"
                size="lg"
                onClick={() => setIsDeleteModalOpen(true)}
                startContent={<FaTrash size={18} />}
              >
                حذف
              </Button>
            </>
          )}

          <Button
            className="font-bold text-lg"
            variant="light"
            color="primary"
            radius="full"
            size="lg"
            onClick={() => window.history.back()}
            endContent={<FaChevronLeft size={18} />}
          >
            عودة
          </Button>
        </div>

        {/* Edit Travel Modal */}
        {isEditModalOpen && (
          <AddTravelModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            travel={travel}
          />
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          placement="center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  تأكيد الحذف
                </ModalHeader>
                <ModalBody>
                  <p>
                    هل أنت متأكد أنك تريد حذف هذه الرحلة؟ لا يمكن التراجع عن
                    هذه العملية.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    إلغاء
                  </Button>
                  <Button
                    color="danger"
                    onPress={handleDeleteTravel}
                    isDisabled={deleteLoading}
                    startContent={deleteLoading ? <Spinner size="sm" /> : <FaTrash />}
                  >
                    حذف
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ViewTravels;