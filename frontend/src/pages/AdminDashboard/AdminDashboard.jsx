import React from 'react';
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import RegisteredItem from './components/RegisteredItem';
import RequestItem from './components/RequestItem';
import { Divider } from "@nextui-org/divider";

function AdminDashboard() {
 // TODO: GET INFO FROM THE BACKEND
  const pendingRequests = [
    { id: 1, name: "حملة ابوعلوه" },
    { id: 2, name: "حملة ابوحميد" },
    { id: 3, name: "حملة ابوبيق" }
  ];

  const registeredAgencies = [
    { id: 1, name: "حملة ابوالحسون" },
    { id: 2, name: "حملة ابوالعبد" }
  ];

  const handleAcceptRequest = (id) => {
    console.log(`Request ${id} accepted.`);
    // Implement logic to accept the request
  };

  const handleDeleteRequest = (id) => {
    console.log(`Request ${id} deleted.`);
    // Implement logic to delete the request
  };

  const handleDeleteAgency = (id) => {
    console.log(`Agency ${id} deleted.`);
    // Implement logic to delete the agency
  };

  return (
    <div className='px-5 lg:px-32 py-5 font-semibold'>
      <Accordion selectionMode='multiple'>
        <AccordionItem key="1" aria-label="Accordion 1" title={`الطلبات قيد الإنتظار (${pendingRequests.length})`} className='pb-3'>
          <div className="flex flex-col -mt-4">
            {pendingRequests.map((request, index) => (
              <div key={request.id}>
                <Divider className="my-4" />

                <div className="flex gap-1 items-center">
                  <span>{index + 1}</span>
                  -
                  <RequestItem
                    name={request.name}
                    id={request.id}
                    onAccept={() => handleAcceptRequest(request.id)}
                    onDelete={() => handleDeleteRequest(request.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem key="2" aria-label="Accordion 2" title={`الحملات المسجلة (${registeredAgencies.length})`} className='pt-3'>
          <div className="flex flex-col -mt-4">
            {registeredAgencies.map((agency, index) => (
              <div key={agency.id}>
                <Divider className="my-4" />

                <div className="flex gap-1 items-center">
                  <span>{index + 1}</span>
                  -
                  <RegisteredItem
                    name={agency.name}
                    id={agency.id}
                    onDelete={() => handleDeleteAgency(agency.id)}
                  />
                </div>
              </div>
            ))}
          </div>
          <Divider className="my-4" />
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default AdminDashboard;
