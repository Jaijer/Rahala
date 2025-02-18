import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="bg-lightGreen p-6">
            <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                <div className="flex flex-col justify-between lg:my-0 items-center lg:items-start">
                    {/* Branding Section */}
                    <div className="flex items-center gap-1 lg:gap-2 hover:cursor-pointer mb-4" onClick={() => navigate('/')}>
                        <span className="text-xl lg:text-2xl font-bold">رحالة</span>
                        <img src="/logo.png" alt="Rahala Logo" className="h-14 w-14" />
                    </div>
                    {/* Social Section for laptop */}
                    <div className="lg:block hidden">
                        <p className="mb-2">حساباتنا في مواقع التواصل الاجتماعي</p>
                        <div className="flex gap-3 text-3xl">
                            <a href="https://x.com/rahala_team" target="_blank" rel="noopener noreferrer" className="block hover:text-gray-700 transition-colors">
                                <FaXTwitter />
                            </a>
                            <a href="https://www.instagram.com/rahala.9/" target="_blank" rel="noopener noreferrer" className="block hover:text-gray-700 transition-colors">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                <div className="grid grid-cols-2 gap-3 text-lg text-center lg:text-start items-center mb-8 lg:mb-0">
                    <Link to="/search" className="text-black hover:underline">اكتشف</Link>
                    <Link to="/contact-us" className="text-black hover:underline">تواصل معنا</Link>
                    <Link to="/about-us" className="text-black hover:underline">من نحن</Link>
                    <Link to="/terms-of-service" className="text-black hover:underline">الشروط و الأحكام</Link>
                    <Link to="/privacy-policy" className="text-black hover:underline col-span-2 lg:col-span-1">سياسة الخصوصية</Link>
                </div>

                {/* Social Section for mobile */}
                <div className="lg:hidden block text-center">
                    <p className="mb-2">حساباتنا في مواقع التواصل الاجتماعي</p>
                    <div className="flex gap-3 text-3xl justify-center">
                        <a href="https://x.com/rahala_team" target="_blank" rel="noopener noreferrer" className="block hover:text-gray-700 transition-colors">
                            <FaXTwitter />
                        </a>
                        <a href="https://www.instagram.com/rahala.9/" target="_blank" rel="noopener noreferrer" className="block hover:text-gray-700 transition-colors">
                            <FaInstagram />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
