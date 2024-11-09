import React from 'react'
import { Button } from '@nextui-org/react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { MdOutlineWavingHand } from "react-icons/md";
import TravelCard from './TravelCard';

function UpcomingTravels({travels}) {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
        <div className='text-xl md:text-2xl font-semibold'>رحلاتي</div>
        {
            travels.length?
            <div className='flex flex-col gap-6'>
                {travels.map((travel)=> {
                    return <TravelCard travel={travel} />
                })}
            </div>

            // If there are no travels
            :<div className="flex flex-col lg:flex-row items-center lg:justify-start gap-4 w-full bg-white rounded-xl border shdow-lg">      
                {/* Text and button section */}
                <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start gap-6 lg:w-1/2 p-6">
                    <MdOutlineWavingHand className="text-darkGreen text-5xl mx-4" />
                    <div className="flex gap-1 text-lg font-semibold">
                    <span>ماعندك حجوزات حالية</span>
                    <span>!</span>
                    </div>            
                    <div>
                        <Button className="bg-greeny rounded-full px-8 py-6 w-auto" onClick={() => navigate('/search')}>
                            <div className="flex gap-1 items-center text-lg justify-center">
                                <span>إبحث عن رحلتك</span>
                                <FaArrowLeft />
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Image on large screens */}
                <div className="hidden lg:block lg:w-2/3">
                    <img src="/happy_children.jpg" alt="Travel" className="rounded-l-xl w-full h-full object-cover" />
                </div>

            </div>
        }
    </div>
  )
}

export default UpcomingTravels