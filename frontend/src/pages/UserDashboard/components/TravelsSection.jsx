import React, { useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Spinner } from "@nextui-org/spinner"; // Import Next UI Spinner
import UpcomingTravels from './UpcomingTravels';
import PreviousTravels from './PreviousTravels';
import api from '../../../api/axios';
import useUserStore from '../../../stores/userDataStore';
import { auth } from '../../../firebase/firebase';

function TravelsSection() {
  const { setUserData } = useUserStore();
  const [travels, setTravels] = useState([]);
  const [isLoading, setIsLoading] = useState(); // Use loading state

  const fetchUserData = async (email) => {
    setIsLoading(true); // Start loading
    try {
      const response = await api.get(`/api/users/email/${email}`);
      setUserData(response.data);
      setTravels(response.data.registeredTravels);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.email); // Always fetch data on reload or user state change
      } else {
        setUserData(null); // Reset user data if user is logged out
        setTravels([]);
      }
    });

    return () => unsubscribe(); // Cleanup the auth listener
  }, [setUserData, setIsLoading]);

  // Memoize filtered travel lists
  const upcomingTravels = useMemo(
    () => travels.filter(travel =>
      new Date(travel.date.departure) >= new Date().setHours(0, 0, 0, 0)
    ),
    [travels]
  );

  const previousTravels = useMemo(
    () => travels.filter(travel =>
      new Date(travel.date.arrival) < new Date().setHours(0, 0, 0, 0)
    ),
    [travels]
  );

  // Show loading spinner if loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-whity">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 px-5 lg:px-32 py-8">
      <UpcomingTravels travels={upcomingTravels} />
      {previousTravels.length ? <PreviousTravels travels={previousTravels} /> : null}
    </div>
  );
}

export default TravelsSection;
