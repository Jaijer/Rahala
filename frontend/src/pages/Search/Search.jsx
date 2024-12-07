import React from 'react'
import SearchBar from '../../components/SearchBar'
import ResultsSection from './components/ResultsSection'

function Search() {
  return (
    <div className="flex flex-col justify-center gap-6 py-5 px-5 lg:px-24">
      <SearchBar />
      <ResultsSection />
    </div>
  )
}

export default Search