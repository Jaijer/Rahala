import React from 'react'
import WelcomeSection from './components/WelcomeSection'
import SearchSection from './components/SearchSection'
import FAQsSection from './components/FAQsSection'
import Footer from '../../components/Footer'

function Landing() {

  return (
      <div className="flex flex-col">
        <WelcomeSection />
        <SearchSection />
        <FAQsSection />
        <Footer />
      </div>
  )
}

export default Landing