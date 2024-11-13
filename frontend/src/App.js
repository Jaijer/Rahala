import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Search from './pages/Search/Search';
import Navbar from './components/Navbar';
import { NextUIProvider } from '@nextui-org/react';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserLogin from './pages/UserLogin/UserLogin';
import AgencyLogin from './pages/AgencyLogin/AgencyLogin';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
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


function App() {
    return (
        <NextUIProvider> 
            <Router>
                <div className='flex flex-col min-h-screen bg-whity'>
                    <ScrollToTop /> {/*Scroll to the top of the page*/}
                    <Navbar /> {/* Navbar appearing in all pages */}
                    <Routes>
                        {/* Here you can add routes (pages) */}
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

                        <Route path="/booking-checkout" element={<BookingCheckout />} />
                        <Route path="/view-travels" element={<ViewTravels />} />
                        <Route path="/book-trip" element={<BookTrip />} />


                    </Routes>
                </div>
                <ToastContainer />
            </Router>
        </NextUIProvider>
    );
}

export default App;
