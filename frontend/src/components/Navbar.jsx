import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Avatar, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { toast } from 'react-toastify';
import { FiUser } from 'react-icons/fi';
import useUserStore from '../stores/userDataStore';

function Navbar() {
    const location = useLocation();
    const isDark = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/login-agency' || location.pathname === '/payment';
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const userType = useUserStore((state) => state.userType);

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
            useUserStore.getState().clearUser();
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

            {isLoggedIn ? (
                <div className='flex lg:gap-16 gap-4 items-center'>
                    <a
                        className={`${isDark ? "text-white" : "text-black"} bg-transparent rounded-full text-lg hover:cursor-pointer hover:opacity-75 transition-all`}
                        onClick={() => navigate('/')}
                    >
                            لوحة التحكم
                    </a>
                    <a
                        className={`${isDark ? "text-white" : "text-black"} bg-transparent rounded-full text-lg hover:cursor-pointer hover:opacity-75 transition-all`}
                        onClick={() => navigate('/search')}
                    >
                            الحملات
                    </a>
                </div>
            ): null}

            {/* Login/Join Us or Logout Button based on authentication state */}
            <div className="flex items-center gap-1 lg:gap-4">
                {isLoggedIn ? (
                    <Dropdown placement="bottom-right">
                    <DropdownTrigger>
                        <Avatar
                            icon={<FiUser />}
                            className="cursor-pointer bg-teal-800 text-white"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" color="secondary">
                        <DropdownItem key="settings" onClick={() => navigate(userType === 'agency' ? '/agency-settings' : '/user-settings')}>
                            اعدادات الحساب
                        </DropdownItem>
                        <DropdownItem key="logout" color="error" onClick={handleLogout}>
                            تسجيل خروج
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                ) : (
                    <>
                        <Button
                            className={`${isDark ? "text-white" : "text-black"} bg-transparent rounded-full text-lg`}
                            onClick={() => navigate('/login-agency')}
                        >
                            سجل حملتك
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
