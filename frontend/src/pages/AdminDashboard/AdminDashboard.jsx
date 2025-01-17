import React, { useEffect, useState } from 'react';
import RegisteredItem from './components/RegisteredItem';
import RequestItem from './components/RequestItem';
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Divider } from "@nextui-org/divider";
import api from '../../api/axios';
import { getAuth } from 'firebase/auth';

function AdminDashboard() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [registeredAgencies, setRegisteredAgencies] = useState([]);

  // Fetch all registered agencies from the backend
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
      
        if (!user) {
          console.error('User not authenticated');
          return;
        }
      
        const token = await user.getIdToken();

        const response = await api.get('/api/admin/agencies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRegisteredAgencies(response.data.agencies);
        console.log('✅ Agencies fetched:', response.data.agencies); // Log the fetched agencies
      } catch (error) {
        console.error('❌ Error fetching agencies:', error);
      }
    };

    fetchAgencies();
  }, []);

  const handleDeleteAgency = async (agencyId) => {
    if (!agencyId) {
      console.error('❌ Agency ID is undefined. Cannot delete agency.');
      return;
    }
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
    
      if (!user) {
        console.error('User not authenticated');
        return;
      }
    
      const token = await user.getIdToken();

      console.log('🗑️ Deleting agency with ID:', agencyId);
      const response = await api.delete(`/api/admin/agencies/${agencyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setRegisteredAgencies(prev => prev.filter(agency => agency._id !== agencyId));
        console.log('✅ Agency deleted successfully:', agencyId);
      } else {
        console.error('❌ Agency deletion failed:', response.data.message);
      }
    } catch (error) {
      console.error('❌ Error deleting agency:', error);
    }
  };

  return (
    <div className='px-5 lg:px-32 py-5 font-semibold'>
      <Accordion selectionMode='multiple'>
        
        {/* <AccordionItem 
          key="1" 
          aria-label="Accordion 1" 
          title={`\u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0642\u064a\u062f \u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631 (${pendingRequests.length})`} 
          className='pb-3'
        >
          <div className="flex flex-col -mt-4">
            {pendingRequests.map((request, index) => (
              <div key={request.id}>
                <Divider className="my-4" />
                <RequestItem name={request.name} id={request.id} />
              </div>
            ))}
          </div>
        </AccordionItem> */}

        <AccordionItem 
          key="2" 
          aria-label="Accordion 2" 
          title={`\u0627\u0644\u062d\u0645\u0644\u0627\u062a \u0627\u0644\u0645\u0633\u062c\u0644\u0629 (${registeredAgencies.length})`} 
          className='pt-3'
        >
          <div className="flex flex-col -mt-4">
            {registeredAgencies.map((agency, index) => (
              <div key={agency._id}>
                <Divider className="my-4" />
                <RegisteredItem 
                  name={agency.name} 
                  id={agency._id} 
                  onDelete={(id) => handleDeleteAgency(id)} 
                />
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
