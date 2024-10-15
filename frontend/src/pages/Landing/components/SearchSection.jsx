import React from 'react'
import SearchBar from '../../../components/SearchBar'

function SearchSection() {
  return (
    <div className='flex flex-col gap-16 justify-center items-center py-36 px-8 md:px-32'>
      <h2 className="text-3xl lg:text-4xl font-semibold text-darkGreen text-center">إبحث عن الحملة الي تناسبك</h2>
      <SearchBar />
      <img src="/search_illustration.svg" alt="Search Illustration" className="md:w-1/2 lg:w-1/3 w-3/4" />
    </div>
  )
}

export default SearchSection