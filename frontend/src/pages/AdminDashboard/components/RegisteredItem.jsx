import React from 'react';
import { MdCancel } from "react-icons/md";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

function RegisteredItem({ name, id, onDelete }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = () => {
    if (id) {
      onDelete(id); // Call the delete handler with the correct ID
      onOpenChange(false);
    } else {
      console.error("ID is undefined. Cannot delete agency.");
    }
  };

  return (
    <div className="flex justify-between items-center">
      <span>{name}</span>

      <MdCancel 
        className='text-4xl text-[#E33629] cursor-pointer' 
        onClick={onOpen} 
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                هل أنت متأكد من حذف هذه الحملة؟
              </ModalHeader>
              <ModalBody>
                <p>
                  هذه العملية لا يمكن التراجع عنها، سيتم حذف الحملة بشكل نهائي.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleDelete}>
                  حذف
                </Button>
                <Button className='bg-darkGreen text-white' onPress={onClose}>
                  إلغاء
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default RegisteredItem;