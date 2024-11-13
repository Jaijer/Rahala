import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Spinner } from "@nextui-org/spinner";
import { NextUIProvider } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import useLoadingStore from './stores/loadingStore'; // Import the loading store
import Landing from './pages/Landing/Landing';
import Search from './pages/Search/Search';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserLogin from './pages/UserLogin/UserLogin';
import AgencyLogin from './pages/AgencyLogin/AgencyLogin';
import AgencyDashboard from './pages/AgencyDashboard/AgencyDashboard';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import AccountSettingsPage from './pages/UserSettings/UserSettings';
import NotificationsSettingsPage from './pages/UserSettings/notifications';
import ResetPasswordPage from './pages/UserSettings/ResetPasswordPage';
import PrivacyPolicy from './pages/FooterPages/PrivacyPolicy';
import TermsOfService from './pages/FooterPages/TermsOfService';
import AboutUs from './pages/FooterPages/AboutUs';
import ContactUs from './pages/FooterPages/ContactUs';
import ScrollToTop from './components/ScrollToTop';
import BookingCheckout from './pages/BookingCheckout/BookingCheckout';
import ViewTravels from './pages/ViewTravels/ViewTravels';
import BookTrip from './pages/BookTrip/BookTrip';
import Payment from './pages/Payment/Payment';

function App() {
    const { isLoading, setIsLoading } = useLoadingStore(); // Use loading store

    useEffect(() => {
        // Set loading to true before starting Firebase auth check
        setIsLoading(true);
        
        // Check Firebase authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false); // Set to false once check is complete
        });
        
        return () => unsubscribe(); // Cleanup on unmount
    }, [setIsLoading]);

    // Display loading spinner while loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-whity">
                <Spinner />
            </div>
        );
    }

    return (
        <NextUIProvider>
            <Router>
                <div className='flex flex-col min-h-screen bg-whity'>
                    <ScrollToTop />
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        <Route path="/agency-dashboard" element={<AgencyDashboard />} />
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/login" element={<UserLogin />} />
                        <Route path="/login-agency" element={<AgencyLogin />} />

                        <Route path="/user-settings" element={<AccountSettingsPage />} />
                        <Route path="/user-settings/notifications" element={<NotificationsSettingsPage />} />
                        <Route path="/user-settings/reset-password" element={<ResetPasswordPage />} />

                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/contact-us" element={<ContactUs />} />

                        <Route path="/booking-checkout" element={<BookingCheckout />} />=======
                        <Route path="/view-travels" element={<ViewTravels />} />
                        <Route path="/book-trip" element={<BookTrip />} />
                        <Route path="/payment" element={<Payment />} />
                          
                    </Routes>
                </div>
                <ToastContainer />
            </Router>
        </NextUIProvider>
    );
}

export default App;
