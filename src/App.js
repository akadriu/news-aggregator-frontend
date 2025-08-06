import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CategoryList from './components/CategoryList';
import CategoryPage from './components/CategoryPage';
import ClusterPage from './components/ClusterPage';
import PersonSidebar from './components/PersonSidebar';
import TopPersonsSidebar from './components/TopPersonsSidebar';
import './App.css';
import NavBar from './components/NavBar';

function AppContent() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPersonData, setSelectedPersonData] = useState(null);
  const location = useLocation();

  const getCurrentCategory = () => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'category' && pathParts[2]) {
      return decodeURIComponent(pathParts[2]);
    }
    return null;
  };

  const handlePersonSelect = (personName, personData) => {
    setSelectedPerson(personName);
    setSelectedPersonData(personData);
  };

  const handlePersonClose = () => {
    setSelectedPerson(null);
    setSelectedPersonData(null);
  };

  const currentCategory = getCurrentCategory();
  const showPersonSidebar = currentCategory && location.pathname !== '/';

  // ✅ Close person view every time route changes (including category)
  useEffect(() => {
    handlePersonClose();
  }, [location.pathname]);

  return (
    <div>
      <NavBar />
      <div className="page-layout">
        <div className="sidebar-left">
          {showPersonSidebar ? (
            <PersonSidebar
              category={currentCategory}
              onPersonSelect={handlePersonSelect}
              selectedPerson={selectedPerson}
              selectedPersonData={selectedPersonData}
              onPersonClose={handlePersonClose}
            />
          ) : (
            <div className="sidebar-left-content">
              <TopPersonsSidebar
                onPersonSelect={handlePersonSelect}
                selectedPerson={selectedPerson}
                selectedPersonData={selectedPersonData}
                onPersonClose={handlePersonClose}
              />
            </div>
          )}
        </div>

        <main className="content-center">
          <Routes>
            <Route path="/" element={<CategoryList />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/:category/cluster/:clusterId" element={<ClusterPage />} />
          </Routes>
        </main>

        <div className="sidebar-right">
          <div className="sidebar-right-content">
            <div className="placeholder-content">
              <h4>Info Plus</h4>
              <p>Ne ndertim...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
