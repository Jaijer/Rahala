import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { toast } from 'react-toastify';

function Navbar() {
    const location = useLocation();
    const isDark = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/login-agency';
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });

        // Cleanup the listener on unmount
        return () => unsubscribe();
    }, []);

    // Handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
            toast.success("تم تسجيل الخروج بنجاح")
            navigate('/');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <nav className={`${isDark ? "bg-darkGreen text-white" : "bg-lightGreen text-black"} px-4 lg:px-20 h-[12vh] flex justify-between items-center`}>
            {/* Logo and Name which navigates to home */}
            <div className="flex items-center gap-1 lg:gap-2 hover:cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-xl lg:text-2xl font-bold">رحالة</span>
                <img src="/logo.png" alt="Rahala Logo" className="h-14 w-14" />
            </div>

            {/* Login/Join Us or Logout Button based on authentication state */}
            <div className="flex items-center gap-1 lg:gap-4">
                {isLoggedIn ? (
                    <Button
                        variant='bordered'
                        className="rounded-full text-lg border-black bg-greeny hover:text-white hover:bg-red-500"
                        onClick={handleLogout}
                    >
                        تسجيل الخروج
                    </Button>
                ) : (
                    <>
                        <Button
                            className={`${isDark ? "text-white" : "text-black"} bg-transparent rounded-full text-lg`}
                            onClick={() => navigate('/login-agency')}
                        >
                            إنضم معنا
                        </Button>
                        <Button
                            className="bg-greeny rounded-full text-lg"
                            onClick={() => navigate('/login')}
                        >
                            سجل دخول
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
