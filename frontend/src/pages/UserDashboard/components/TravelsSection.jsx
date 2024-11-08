import React from 'react'
import UpcomingTravels from './UpcomingTravels'
import PreviousTravels from './PreviousTravels'

function TravelsSection() {
  // Updated travels array to match the User model structure
  const travels = [
    {
      travel: {
        travelName: "رحلة إلى الهند",
        capacity: 25,
        from: "الرياض",
        destination: "نيودلهي",
        dates: [
          {
            departure: new Date("2024-03-01"),
            arrival: new Date("2024-03-10")
          }
        ],
        description: "استكشف معالم الهند الثقافية والطبيعية في رحلة مميزة.",
        image: "https://i.ibb.co/DDn1SwT/hazeem.jpg",
        packages: [
          { title: "الباقة الاقتصادية", price: 4500 },
          { title: "الباقة الفاخرة", price: 9500 }
        ],
        isAvailable: true,
        agency: "6722924db1b0f7a345f20cbf"
      },
      package: "الباقة الاقتصادية", // The selected package
      date: { departure: new Date("2024-03-01"), arrival: new Date("2024-03-10") } // The selected date (departure and arrival)
    },
    {
      travel: {
        travelName: "مغامرة في دبي",
        capacity: 20,
        from: "الرياض",
        destination: "دبي",
        dates: [
          {
            departure: new Date("2024-12-01"),
            arrival: new Date("2024-12-07")
          }
        ],
        description: "رحلة شيقة لاستكشاف مدينة دبي النابضة بالحياة، تتضمن جولات سياحية، وتسوق، وسفاري الصحراء.",
        image: "https://i.ibb.co/DDn1SwT/hazeem.jpg",
        packages: [
          { title: "الباقة العادية", price: 3000 },
          { title: "الباقة الممتازة", price: 5000 }
        ],
        isAvailable: true,
        agency: "6722924db1b0f7a345f20cbf"
      },
      package: "الباقة الممتازة", // The selected package
      date: { departure: new Date("2024-12-01"), arrival: new Date("2024-12-07") } // The selected date (departure and arrival)
    },
    {
      travel: {
        travelName: "عجائب الشتاء في سويسرا",
        capacity: 15,
        from: "جدة",
        destination: "زيورخ",
        dates: [
          {
            departure: new Date("2024-12-20"),
            arrival: new Date("2025-01-02")
          }
        ],
        description: "استمتع بسحر المناظر الثلجية في سويسرا، ومنتجعات التزلج، وأسواق عيد الميلاد.",
        image: "https://i.ibb.co/DDn1SwT/hazeem.jpg",
        packages: [
          { title: "الباقة الاقتصادية", price: 8000 },
          { title: "الباقة الفاخرة", price: 15000 }
        ],
        isAvailable: true,
        agency: "6722924db1b0f7a345f20cbf"
      },
      package: "الباقة الفاخرة", // The selected package
      date: { departure: new Date("2024-12-20"), arrival: new Date("2025-01-02") } // The selected date (departure and arrival)
    }
  ];

    // Filter travels based on the current date
    const currentDate = new Date();
    const upcomingTravels = travels.filter(travel => new Date(travel.date.departure) > currentDate);
    const previousTravels = travels.filter(travel => new Date(travel.date.arrival) < currentDate);
  

  return (
    <div className="flex flex-col gap-16 px-5 lg:px-32 py-8 ">
      <UpcomingTravels travels={upcomingTravels} />
      {travels.length ? <PreviousTravels travels={previousTravels} /> : null}
    </div>
  );
}

export default TravelsSection;
