import React, { useEffect, useState } from 'react';
import SortByBtn from './SortByBtn';
import TravelCard from '../../../components/TravelCard';
import useSearchStore from '../../../stores/searchStore';
import api from '../../../api/axios';
import { Spinner } from "@nextui-org/spinner";

function ResultsSection() {
    const { sortBy, departure, destination, date, alterSearch } = useSearchStore();
    const [results, setResults] = useState([]); // State to store fetched travels
    const [isLoading, setIsLoading] = useState(false); // Local loading state

    // Fetch travels from backend
    useEffect(() => {
        const fetchTravels = async () => {
            setIsLoading(true);
            try {
                const params = {
                    ...(departure && { departure }),
                    ...(destination && { destination }),
                    ...(date && { date })
                };
                
                const response = await api.get('/api/travels', { params });
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching travels:", error);
            }
            setIsLoading(false);
        };
        
        fetchTravels();
    }, [alterSearch]); // Trigger only when alterSearch changes

    // Sorting logic
    const sortedResults = [...results].sort((a, b) => {
        if (sortBy === "الأقل سعراً") {
            return a.packages[0].price - b.packages[0].price;
        } else if (sortBy === "الأقرب") {
            return new Date(a.dates[0].departure) - new Date(b.dates[0].departure);
        }
        return 0;
    });

    return (
        isLoading ? (
            <div className="flex justify-center items-center my-24">
                <Spinner />
            </div>
        ) : sortedResults.length ? (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-2 items-center">
                    <div className="flex gap-1 text-xl lg:text-2xl font-semibold items-center">
                        <span>النتائج</span>
                        <span>({sortedResults.length})</span>
                    </div>
                    <SortByBtn />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 gap-y-6 lg:gap-y-8">
                    {sortedResults.map((result, index) => (
                        <TravelCard key={index} travel={result} />
                    ))}
                </div>
            </div>
        ) : (
            <div className="text-center text-xl lg:text-2xl text-grayish my-20">لا توجد نتائج</div>
        )
    );
}

export default ResultsSection;
