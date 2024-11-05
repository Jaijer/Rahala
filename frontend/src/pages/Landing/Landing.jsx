import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase'; // Adjust path as needed
import WelcomeSection from './components/WelcomeSection';
import SearchSection from './components/SearchSection';
import FAQsSection from './components/FAQsSection';
import Footer from '../../components/Footer';
import useUserStore from '../../stores/userDataStore';
import api from '../../api/axios';

function Landing() {
  const navigate = useNavigate();
  const { setUserData, setUserType } = useUserStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user type from AuthUser collection
          const authUserResponse = await api.get(`/api/auth/${firebaseUser.email}`);
          const userType = authUserResponse.data.userType;
          setUserType(userType);

          // Get user data based on user type
          let userData;
          switch (userType) {
            case 'user':
              userData = await api.get(`/api/users/email/${firebaseUser.email}`);
              setUserData(userData.data);
              navigate('/dashboard');
              break;
            
            case 'agency':
              userData = await api.get(`/api/agencies/email/${firebaseUser.email}`);
              setUserData(userData.data);
              navigate('/agency-dashboard');
              break;
            
            case 'admin':
              userData = await api.get(`/api/admin/email/${firebaseUser.email}`);
              setUserData(userData.data);
              navigate('/admin-dashboard');
              break;

            default:
              console.error('Unknown user type:', userType);
              break;
          }

        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle error appropriately (show toast, etc.)
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate, setUserData, setUserType]);

  return (
    <div className="flex flex-col">
      <WelcomeSection />
      <SearchSection />
      <FAQsSection />
      <Footer />
    </div>
  );
}

export default Landing;