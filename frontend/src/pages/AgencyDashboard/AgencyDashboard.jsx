import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import useUserStore from '../../stores/userDataStore';
import api from '../../api/axios';
import TravelCard from '../../components/TravelCard';
import { IoMdAddCircle } from "react-icons/io";
import { useDisclosure } from "@nextui-org/react";
import AddTravelModal from './components/AddTravelModal';

function AgencyDashboard() {
  const { userData } = useUserStore();
  const [agencyData, setAgencyData] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal control

  useEffect(() => {
    const fetchAgencyData = async () => {
      if (!userData || !userData.email) return;

      try {
        const response = await api.get(`/api/agencies/email/${userData.email}`);
        setAgencyData(response.data); // Assuming the API response contains all agency data
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching agency data:", error);
      }
    };

    fetchAgencyData();
  }, [userData]);

  // Fallback for travels if agencyData is not loaded
  const travels = agencyData?.travels || [];

  const handleSort = (criteria) => {
    const sortedTravels = [...travels];
    if (criteria === 'status') {
      sortedTravels.sort((a, b) => a.isActive - b.isActive);
    } else if (criteria === 'nearest') {
      sortedTravels.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (criteria === 'seats') {
      sortedTravels.sort((a, b) => b.seatsLeft - a.seatsLeft);
    }
    setAgencyData({ ...agencyData, travels: sortedTravels });
  };

  return (
    <div className="flex flex-col py-5 px-5 lg:px-24">
      {/* Header with Sort and Results */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        {/* Results Count */}
        {travels.length?
        <div className="text-sm sm:text-lg font-bold text-grayish">
        رحلاتي ({travels.length})
      </div>:null}
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 gap-y-6 lg:gap-y-8">
          {travels.map((result, index) => (
            <TravelCard key={index} travel={result} />
          ))}
        </div>
      </div>

      {/* Add Travel Button */}
      <div>
        <button
          className="flex items-center text-darkGreen gap-2 font-bold text-2xl sm:text-4xl hover cursor-pointer hover:opacity-90 transition-all"
          onClick={onOpen}
        >
          <span>أضف رحلة</span>
          <IoMdAddCircle />
        </button>
      </div>

      {/* Add Travel Modal */}
      <AddTravelModal isOpen={isOpen} onClose={onOpenChange} />
    </div>
  );
}

export default AgencyDashboard;
