import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Search from './pages/Search/Search';

function App() {
    return (
        <Router>
            <div>
              {/* Navigating between pages  */}
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/search" element={<Search />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
