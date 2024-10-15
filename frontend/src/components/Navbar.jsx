import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';

function Navbar() {
    const location = useLocation(); // Access the current route

    // Apply style depending on the route
    const isLanding = location.pathname === '/';
    const navigate = useNavigate();

    return (
        <nav className={`${isLanding? "bg-darkGreen text-white" : "bg-lightGreen text-black"} px-4 lg:px-20 h-[12vh] flex justify-between items-center`}>
            {/* Logo and Name which navigates to home */}
            <div className="flex items-center gap-1 lg:gap-2 hover:cursor-pointer" onClick={()=> navigate('/')}>
                <span className="text-xl lg:text-2xl font-bold">رحالة</span>
                <img src="/logo.png" alt="Rahala Logo" className="h-14 w-14" />
            </div>

            {/* Login Button using NextUI Button */}
            <div className="flex items-center gap-1 lg:gap-4">
                <Button className={`${isLanding? "text-white":"text-black"} bg-transparent rounded-full text-lg`}
                onClick={()=> navigate('/')} >
                    إنضم معنا   
                </Button>
                <Button className='bg-greeny rounded-full text-lg'
                onClick={()=> navigate('/')} >
                    سجل دخول
                </Button>
            </div>
        </nav>
    );
}

export default Navbar;
