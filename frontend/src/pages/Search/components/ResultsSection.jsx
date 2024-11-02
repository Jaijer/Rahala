import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SortByBtn from './SortByBtn';
import TravelCard from '../../../components/TravelCard';
import useSearchStore from '../../../stores/searchStore';

function ResultsSection() {
    const { sortBy, departure, destination, date, alterSearch } = useSearchStore(); // Access search and sort options from the store
    const [results, setResults] = useState([]); // State to store fetched travels

    // Fetch travels from backend
    useEffect(() => {
        const fetchTravels = async () => {
            try {
                // Build query parameters
                const params = {
                    ...(departure && { departure }),
                    ...(destination && { destination }),
                    ...(date && { date })
                };
                
                const response = await axios.get('/api/travels', { params }); // Adjust URL as needed
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching travels:", error);
            }
        };
        fetchTravels();
    }, [alterSearch]); // Add dependencies

    // Sorting logic
    const sortedResults = [...results].sort((a, b) => {
        if (sortBy === "الأقل سعراً") {
            return a.packages[0].price - b.packages[0].price; // Assuming first package price
        } else if (sortBy === "الأقرب") {
            return new Date(a.dates[0].departure) - new Date(b.dates[0].departure); // Assuming first date
        } else {
            return results;
        }
    });

    return (
        sortedResults.length ? (
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
            <div className="text-center text-xl lg:text-2xl text-grayish">لا توجد نتائج</div>
        )
    );
}

export default ResultsSection;
