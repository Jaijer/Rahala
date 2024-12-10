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
} from "@nextui-org/react";
import api from "../../api/axios";
import useTravelStore from "../../stores/travelStore";
import useUserStore from "../../stores/userDataStore";
import AddTravelModal from "../AgencyDashboard/components/AddTravelModal";
import TravelersList from "./TravelersList";

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

  useEffect(() => {
    const fetchTravel = async () => {
      try {
        const response = await api.get(`api/travels/${id}`);
        setTravel(response.data); // Store travel data in Zustand
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
    setDeleteLoading(true); // Start loading
    try {
      await api.delete(`/api/travels/${id}`);
      window.history.back(); // Navigate back after successful deletion
    } catch (error) {
      console.error("Error deleting travel:", error);
    } finally {
      setDeleteLoading(false); // Stop loading
      setIsDeleteModalOpen(false);
    }
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
          <div className="lg:col-span-8 space-y-6">
            {/* Agency Info */}
            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold text-[#1B4348]">
                عدد المقاعد: {travel.capacity}
              </h2>
              <h2 className="text-xl lg:text-2xl font-bold text-[#1B4348]">
                {travel.agency?.name}
              </h2>
            </div>

            {/* Route with Arrow */}
            <div className="flex items-center gap-4 text-2xl lg:text-3xl font-bold text-[#1B4348] py-2">
              <span>{travel.from}</span>
              <span className="text-[#757575]">←</span>
              <span>{travel.destination}</span>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">
                وصف الرحلة
              </h2>
              <p className="text-lg lg:text-xl text-[#757575] max-w-2xl">
                {travel.description}
              </p>
            </div>

            {/* Date Section */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1B4348]">
                تواريخ الرحلة
              </h2>
              <ul className="text-lg lg:text-xl text-[#757575]">
                {travel.dates.map((date) => (
                  <li key={date._id} className="flex gap-2">
                    <span>
                      {new Date(date.departure).toLocaleDateString("ar-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    -
                    <span>
                      {new Date(date.arrival).toLocaleDateString("ar-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travelers Section */}
            {isTravelOwner? <TravelersList travellers={travel.travellers} />: null}
          </div>

          {/* Image Column */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Image
                isBlurred
                src={travel.image}
                alt="Travel Image"
                classNames={{
                  wrapper: "flex items-center justify-center",
                  img: "object-cover",
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
          >
            عودة&gt;
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
                    isDisabled={deleteLoading} // Disable the button while loading
                  >
                    {deleteLoading ? <Spinner size="sm" /> : "حذف"} {/* Show spinner or text */}
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
