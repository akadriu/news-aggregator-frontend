import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import './components/SearchSidebar.css';
import NavBar from './components/NavBar';

// Lazy load components
const CategoryList = lazy(() => import('./components/CategoryList'));
const CategoryPage = lazy(() => import('./components/CategoryPage'));
const ClusterPage = lazy(() => import('./components/ClusterPage'));
const PersonSidebar = lazy(() => import('./components/PersonSidebar'));
const TopPersonsSidebar = lazy(() => import('./components/TopPersonsSidebar'));
const SearchSidebar = lazy(() => import('./components/SearchSidebar'));

// Loading fallback component
const LoadingSpinner = ({ className = "" }) => (
  <div className={`loading-spinner ${className}`}>
    <div className="spinner"></div>
    <p>Duke u ngarkuar...</p>
  </div>
);

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

  // Close person view every time route changes
  useEffect(() => {
    handlePersonClose();
  }, [location.pathname]);

  return (
    <div>
      <NavBar />
      <div className="page-layout">
        <div className="sidebar-left">
          <Suspense fallback={<LoadingSpinner className="sidebar-loading" />}>
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
          </Suspense>
        </div>

        <main className="content-center">
          <Suspense fallback={<LoadingSpinner className="main-loading" />}>
            <Routes>
              <Route path="/" element={<CategoryList />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/category/:category/cluster/:clusterId" element={<ClusterPage />} />
            </Routes>
          </Suspense>
        </main>

        <div className="sidebar-right">
          <div className="sidebar-right-content">
            <Suspense fallback={<LoadingSpinner className="sidebar-loading" />}>
              <SearchSidebar />
            </Suspense>
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