import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Search from './pages/Search/Search';
import Navbar from './components/Navbar';
import { NextUIProvider } from '@nextui-org/react';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

function App() {
    return (
        <NextUIProvider> 
            <Router>
                <div className='flex flex-col min-h-screen bg-whity'>
                    <Navbar /> {/* Navbar appearing in all pages */}
                    <Routes>
                        {/* Here you can add routes (pages) */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </div>
            </Router>
        </NextUIProvider>
    );
}

export default App;
