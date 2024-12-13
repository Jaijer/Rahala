import React from 'react'
import { Button } from '@nextui-org/react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function WelcomeSection() {
    const navigate = useNavigate();

    return (
        <div className='flex items-center justify-center text-white bg-darkGreen p-4 min-h-[88vh]'>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-1 lg:justify-between items-center">
                <div className="flex flex-col gap-3 items-center text-center lg:items-start">
                    <h2 className="text-3xl lg:text-4xl font-semibold">
                        داخ راسك وأنت تدور حملات
                    </h2>
                    <h3 className="text-xl lg:text-2xl">
                        تعال شوف حملاتنا الفخمة
                    </h3>
                    <div>
                        <Button className='bg-greeny rounded-full mt-4 text-xl lg:text-2xl px-8 py-6' onClick={()=>navigate('/search')}>
                            <div className="flex gap-1 items-center justify-center">
                                <span>إبحث عن رحلتك</span>
                                <FaArrowLeft />
                            </div> 
                        </Button>
                    </div>
                </div>
                <img src="/bus_illustration.svg" alt="Bus Illustration" className="lg:w-1/2 w-3/4" />
            </div>
        </div>
    )
}

export default WelcomeSection
