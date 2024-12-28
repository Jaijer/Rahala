import React, { useEffect, useState, useRef } from 'react';
import SortByBtn from './SortByBtn';
import TravelCard from '../../../components/TravelCard';
import useSearchStore from '../../../stores/searchStore';
import api from '../../../api/axios';
import { Spinner } from "@nextui-org/spinner";

function ResultsSection() {
    const { sortBy, departure, destination, date, alterSearch } = useSearchStore();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const loaderRef = useRef(null); // Ref for the scroll trigger

    const fetchTravels = async (reset = false) => {
        setIsLoading(true);
        try {
            const params = {
                departure,
                destination,
                date,
                page,
                limit: 12,
            };

            const response = await api.get('/api/travels', { params });
            const { travels, total } = response.data;

            setResults((prev) => (reset ? travels : [...prev, ...travels]));
            setTotal(total);
        } catch (error) {
            console.error("Error fetching travels:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        setPage(1); // Reset page when search changes
        fetchTravels(true);
    }, [alterSearch]);

    // Observe the loader to trigger fetching new data
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && results.length < total && !isLoading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [results, total, isLoading]);

    useEffect(() => {
        if (page > 1) fetchTravels();
    }, [page]);

    const sortedResults = [...results].sort((a, b) => {
        if (sortBy === "الأقل سعراً") {
            return a.packages[0].price - b.packages[0].price;
        } else if (sortBy === "الأقرب") {
            return new Date(a.dates[0].departure) - new Date(b.dates[0].departure);
        }
        return 0;
    });

    return (
        <>
            {isLoading && page === 1 ? (
                <div className="flex justify-center items-center my-24">
                    <Spinner />
                </div>
            ) : sortedResults.length ? (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-2 items-center">
                        <div className="flex gap-1 text-xl lg:text-2xl font-semibold items-center">
                            <span>النتائج</span>
                            <span>({total})</span>
                        </div>
                        <SortByBtn />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 gap-y-6 lg:gap-y-8">
                        {sortedResults.map((result, index) => (
                            <TravelCard key={index} travel={result} />
                        ))}
                    </div>

                    <div ref={loaderRef} className="flex justify-center my-4">
                        {isLoading && <Spinner />}
                    </div>
                </div>
            ) : (
                <div className="text-center text-xl lg:text-2xl text-grayish my-20">لا توجد نتائج</div>
            )}
        </>
    );
}

export default ResultsSection;
