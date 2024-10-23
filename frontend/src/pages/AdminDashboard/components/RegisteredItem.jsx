import React from 'react';
import { MdCancel } from "react-icons/md";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

function RegisteredItem({ name, id, onDelete }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = () => {
    onDelete(); // Call the delete handler
    onOpenChange(false);
  };

  return (
    <div className="flex justify-between items-center flex-grow">
      <span>{name}</span>

      <div className="flex gap-2 items-center">
        <MdCancel
          className='text-4xl text-[#E33629] hover:cursor-pointer hover:opacity-85'
          onClick={onOpen}
        />
      </div>

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
