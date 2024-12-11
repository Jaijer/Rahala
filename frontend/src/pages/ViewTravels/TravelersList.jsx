import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { MdCancel } from "react-icons/md";
import api from "../../api/axios";
import { toast } from "react-toastify";

const TravelersList = ({ travellers: initialTravellers }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [travellers, setTravellers] = useState(initialTravellers); // Local state for travellers
  const [selectedTravellerId, setSelectedTravellerId] = useState(null);
  const [travellerName, setTravellerName] = useState(""); // Store selected traveller's name
  const [loading, setLoading] = useState(false); // Track loading state

  if (!travellers || travellers.length === 0) {
    return (
      <div className="text-lg lg:text-xl text-[#757575]">
        لم يتم تسجيل أي مسافر حتى الآن.
      </div>
    );
  }

  const handleDelete = async () => {
    setLoading(true); // Set loading state to true
    try {
      // Send delete request to backend
      await api.delete(`/api/users/travelers/${selectedTravellerId}`);
      // Update local state to remove the deleted traveler
      setTravellers((prevTravellers) =>
        prevTravellers.filter((traveller) => traveller._id !== selectedTravellerId)
      );
      toast.success("تم حذف المسافر بنجاح");
      onOpenChange(false); // Close the modal
    } catch (error) {
      console.error("Failed to delete traveler:", error);
      toast.error("فشل حذف المسافر");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="space-y-4">
      <Accordion
        variant="bordered"
        classNames={{
          base: "border-2 border-[#1B4348]",
          title: "text-[#1B4348] font-bold text-xl py-3 px-4",
          trigger: "hover:bg-gray-100 transition-colors duration-300",
        }}
      >
        <AccordionItem
          key="travellers"
          title="قائمة المسافرين"
          classNames={{
            title: "text-[#1B4348] font-bold text-xl",
          }}
        >
          <div className="flex flex-col gap-4">
            {travellers.map((traveller, index) => (
              <div
                key={traveller._id}
                className="flex justify-between items-center border-b pb-4 last:border-b-0 bg-lightGreen p-3 rounded-xl"
              >
                <div className="flex flex-col gap-2">
                  <p>
                    <strong>المسافر {index + 1}: </strong>
                    {traveller.user.name}
                  </p>
                  <p>
                    <strong>الباقة:</strong> {traveller.package}
                  </p>
                  <p>
                    <strong>التاريخ:</strong>{" "}
                    {formatDate(traveller.date.departure)} -{" "}
                    {formatDate(traveller.date.arrival)}
                  </p>
                </div>
                <MdCancel
                  className="text-4xl text-[#E33629] hover:cursor-pointer hover:opacity-85"
                  onClick={() => {
                    setSelectedTravellerId(traveller._id);
                    setTravellerName(traveller.user.name); // Store the name of the traveler
                    onOpen();
                  }}
                />
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            هل أنت متأكد من حذف هذا المسافر؟
          </ModalHeader>
          <ModalBody>
            <p>
              هذه العملية لا يمكن التراجع عنها، سيتم حذف {travellerName} بشكل
              نهائي.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              isDisabled={loading} // Disable button while loading
              isLoading={loading} // Show loading spinner
              onPress={handleDelete}
            >
              حذف
            </Button>
            <Button
              className="bg-darkGreen text-white"
              onPress={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TravelersList;
