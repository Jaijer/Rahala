import React, { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import Footer from '../../components/Footer';
import TravelCard from './components/TravelCard';
import AddTravel from './components/AddTravel';

function AgencyDashboard() {
  const [travels, setTravels] = useState([
    {
      flightNumber: 'AF123',
      from: 'الدمام',
      to: 'ايطاليا',
      startDate: '2023-12-01',
      endDate: '2023-12-07',
      seats: 30,
      seatsLeft: 23,
      revenue: 12000,
      isActive: true,
      image: '',
      description: 'رحلة ممتعة الى ايطاليا.',
    },
    {
      flightNumber: 'BA456',
      from: 'لندن',
      to: 'طويو',
      startDate: '2023-11-10',
      endDate: '2023-11-15',
      seats: 40,
      seatsLeft: 0,
      revenue: 20000,
      isActive: true,
      image: '',
      description: 'رحبة ممتعة الى طوكيو.',
    },
    {
      flightNumber: 'QR789',
      from: 'الدوجة',
      to: 'سيدني',
      startDate: '2023-10-01',
      endDate: '2023-10-10',
      seats: 50,
      seatsLeft: 10,
      revenue: 30000,
      isActive: false,
      image: '',
      description: 'رحلة ممتعة الى سيدني.',
    },
  ]);

  const handleSort = (criteria) => {
    const sortedTravels = [...travels];
    if (criteria === 'status') {
      sortedTravels.sort((a, b) => b.isActive - a.isActive);
    } else if (criteria === 'nearest') {
      sortedTravels.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (criteria === 'seats') {
      sortedTravels.sort((a, b) => b.seatsLeft - a.seatsLeft);
    }
    setTravels(sortedTravels);
  };

  // Calculate Statistics
  const totalRevenue = travels.reduce((acc, travel) => acc + travel.revenue, 0);
  const activeTravels = travels.filter((travel) => travel.isActive).length;
  const totalBookedSeats = travels.reduce((acc, travel) => acc + (travel.seats - travel.seatsLeft), 0);

  return (
    <div className="flex flex-col min-h-screen bg-whity">
      {/* Search Bar */}
      <div className="m-8">
        <SearchBar />
      </div>

      {/* Header with Sort and Results */}
      <div className="flex justify-between items-center px-8 mb-4">
        {/* Results Count */}
        <div className="text-lg font-bold text-grayish">
          النتائج ({travels.length})
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center">
          <label htmlFor="sort" className="text-grayish font-bold ml-2">
            ترتيب بحسب:
          </label>
          <select
            id="sort"
            onChange={(e) => handleSort(e.target.value)}
            className="bg-white border border-grayish rounded-lg px-4 py-2 text-darkGreen"
          >
            <option value="">اختار...</option>
            <option value="status">الحالة</option>
            <option value="nearest">الأقرب تاريخا</option>
            <option value="seats">المقاعد المتاحة</option>
          </select>
        </div>
      </div>

      {/* Labels Above Travel List */}
      <div className="grid grid-cols-8 px-8 mb-2 items-center text-grayish font-bold">
        <div className="flex justify-center">الحالة</div>
        <div>رقم الرحلة</div>
        <div>الوجهة</div>
        <div>تاريخ المغادرة</div>
        <div>تاريخ العودة</div>
        <div>المقاعد</div>
        <div>الربح</div>
      </div>

      {/* Travel Cards */}
      <div className="flex flex-col flex-grow px-8">
        {travels.map((travel, index) => (
          <TravelCard key={index} travel={travel} />
        ))}
      </div>

      {/* Add Travel Button */}
      <div className="flex items-center px-8 mt-6">
        <span className="mr-8 text-darkGreen font-bold text-3xl ">اضف رحلة</span>
        <AddTravel travels={travels} setTravels={setTravels} />
      </div>

      {/* Statistics Section */}
      <div className="mr-8 mt-6 text-4xl font-bold text-darkGreen">
        <span>الاحصائيات</span>
      </div>
      <div className="grid grid-cols-3 gap-4 px-8 mt-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold text-darkGreen">مجموع الارباح</h3>
          <p className="text-2xl font-semibold text-grayish">{totalRevenue} ر.س</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold text-darkGreen">الرحلات النشطة</h3>
          <p className="text-2xl font-semibold text-grayish">{activeTravels}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold text-darkGreen">مجموع الحجوزات</h3>
          <p className="text-2xl font-semibold text-grayish">{totalBookedSeats}</p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AgencyDashboard;
