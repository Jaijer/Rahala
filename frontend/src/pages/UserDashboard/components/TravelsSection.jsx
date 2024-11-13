import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import UpcomingTravels from './UpcomingTravels';
import PreviousTravels from './PreviousTravels';
import api from '../../../api/axios';
import useUserStore from '../../../stores/userDataStore';
import { auth } from '../../../firebase/firebase';
import useLoadingStore from '../../../stores/loadingStore';

function TravelsSection() {
  const { userData, setUserData } = useUserStore();
  const [travels, setTravels] = useState(userData?.registeredTravels || []);
  const {setIsLoading} = useLoadingStore();

  useEffect(() => {
    const fetchUserData = async (email) => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/users/email/${email}`);
        setUserData(response.data);
        setTravels(response.data.registeredTravels);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    };

    // Set up the auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!userData) {
          fetchUserData(user.email);
        } else {
          setTravels(userData.registeredTravels);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userData, setUserData]);

  // Filter travels based on the current date
  const currentDate = new Date();
  const upcomingTravels = travels.filter(travel => new Date(travel.date.departure) > currentDate);
  const previousTravels = travels.filter(travel => new Date(travel.date.arrival) < currentDate);

  return (
    <div className="flex flex-col gap-16 px-5 lg:px-32 py-8">
      <UpcomingTravels travels={upcomingTravels} />
      {previousTravels.length? <PreviousTravels travels={previousTravels} />: null}
    </div>
  );
}

export default TravelsSection;