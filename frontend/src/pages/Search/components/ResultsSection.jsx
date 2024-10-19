import React from 'react';
import SortByBtn from './SortByBtn';
import TravelCard from '../../../components/TravelCard';
import useSearchStore from '../../../stores/searchStore';

function ResultsSection() {
    const { sortBy } = useSearchStore(); // Access the sort option from the store

    const results = [
        {
          destination: "المدينة المنورة",
          from: "القطيف",
          price: 900,
          agency: "شركة النور",
          departure_date: new Date('2024-11-10'),
          arrival_date: new Date('2024-11-12'),
          image_url: "https://i.ibb.co/DDn1SwT/hazeem.jpg"
        },
        {
          destination: "أبها",
          from: "صفوى",
          price: 700,
          agency: "حملة الريان",
          departure_date: new Date('2024-12-05'),
          arrival_date: new Date('2024-12-07'),
          image_url: "https://i.ibb.co/DDn1SwT/hazeem.jpg"
        },
        {
          destination: "الطايف",
          from: "سيهات",
          price: 600,
          agency: "مكتب السلام",
          departure_date: new Date('2024-10-22'),
          arrival_date: new Date('2024-10-24'),
          image_url: "https://i.ibb.co/6R1TnDL/Me-and-big-guy-velhiem.png"
        },
        {
          destination: "حائل",
          from: "المدينة المنورة",
          price: 500,
          agency: "شركة الطموح",
          departure_date: new Date('2024-09-15'),
          arrival_date: new Date('2024-09-16'),
          image_url: "https://i.ibb.co/DDn1SwT/hazeem.jpg"
        },
        {
          destination: "تبوك",
          from: "الأحساء",
          price: 800,
          agency: "حملة الفارس",
          departure_date: new Date('2024-08-25'),
          arrival_date: new Date('2024-08-27'),
          image_url: "https://i.ibb.co/6R1TnDL/Me-and-big-guy-velhiem.png"
        },
        {
          destination: "تركيا",
          from: "البحرين",
          price: 3000,
          agency: "مكتب البركة",
          departure_date: new Date('2024-07-05'),
          arrival_date: new Date('2024-07-10'),
          image_url: "https://i.ibb.co/6R1TnDL/Me-and-big-guy-velhiem.png"
        },
        {
          destination: "ماليزيا",
          from: "الدمام",
          price: 3500,
          agency: "شركة النخبة",
          departure_date: new Date('2024-06-10'),
          arrival_date: new Date('2024-06-15'),
          image_url: "https://i.ibb.co/DDn1SwT/hazeem.jpg"
        },
        {
          destination: "اتلانتا",
          from: "الخبر",
          price: 4500,
          agency: "شركة السراج",
          departure_date: new Date('2024-05-20'),
          arrival_date: new Date('2024-05-25'),
          image_url: "https://i.ibb.co/DDn1SwT/hazeem.jpg"
        },
        {
          destination: "شرم الشيخ",
          from: "القطيف",
          price: 2500,
          agency: "حملة الجوهرة",
          departure_date: new Date('2024-04-10'),
          arrival_date: new Date('2024-04-15'),
          image_url: "https://i.ibb.co/6R1TnDL/Me-and-big-guy-velhiem.png"
        }
      ];
      

    // Sorting logic
    const sortedResults = [...results].sort((a, b) => {
        if (sortBy === "الأقل سعراً") {
            return a.price - b.price; // Sort by price (ascending)
        } else if (sortBy === "الأقرب") {
            return new Date(a.departure_date) - new Date(b.departure_date); // Sort by date (ascending)
        } else {
            return results; // Default or other sorting criteria (for "الأشهر")
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
