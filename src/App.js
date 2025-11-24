import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import './components/SearchSidebar.css';
import NavBar from './components/NavBar';

// Direct imports instead of lazy
import CategoryList from './components/CategoryList';
import CategoryPage from './components/CategoryPage';
import ClusterPage from './components/ClusterPage';
import PersonSidebar from './components/PersonSidebar';
import TopPersonsSidebar from './components/TopPersonsSidebar';
import SearchSidebar from './components/SearchSidebar';
import Impressum from './components/Impressum';

// Custom hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

function AppContent() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedPersonData, setSelectedPersonData] = useState(null);
  const [mobileView, setMobileView] = useState('center');
  const location = useLocation();
  const isMobile = useIsMobile();

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

  useEffect(() => {
    handlePersonClose();
    setMobileView('center');
  }, [location.pathname]);

  const goToLeftSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('LEFT CLICKED - Current state:', mobileView, '-> left');
    setMobileView('left');
  };
  
  const goToRightSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('RIGHT CLICKED - Current state:', mobileView, '-> right');
    setMobileView('right');
  };
  
  const goToCenter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('CENTER CLICKED - Current state:', mobileView, '-> center');
    setMobileView('center');
  };

  useEffect(() => {
    console.log('=== MOBILE VIEW CHANGED ===');
    console.log('New state:', mobileView);
    console.log('Is mobile:', isMobile);
    console.log('Show person sidebar:', showPersonSidebar);
    console.log('Current category:', currentCategory);
  }, [mobileView, isMobile, showPersonSidebar, currentCategory]);

  return (
    <div>
      <NavBar />
          
      {isMobile && (
        <div className="mobile-nav-arrows" style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 9999
        }}>
          {mobileView !== 'left' && (
            <button 
              className="nav-arrow nav-arrow-left" 
              onClick={goToLeftSidebar}
              onTouchStart={goToLeftSidebar}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                background: '#cc0000',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
              title="Persona"
            >
              ◀
            </button>
          )}
          
          {mobileView !== 'center' && (
            <button 
              className="nav-arrow nav-arrow-center" 
              onClick={goToCenter}
              onTouchStart={goToCenter}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                background: '#cc0000',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
              title="Kryesore"
            >
              ◆
            </button>
          )}
          
          {mobileView !== 'right' && (
            <button 
              className="nav-arrow nav-arrow-right" 
              onClick={goToRightSidebar}
              onTouchStart={goToRightSidebar}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                background: '#cc0000',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
              title="Këro"
            >
              ▶
            </button>
          )}
        </div>
      )}

      <div className="page-layout">
        {/* LEFT SIDEBAR */}
        <div 
          className={`sidebar-left ${isMobile && mobileView === 'left' ? 'mobile-active' : ''}`}
        >
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

        {/* CENTER CONTENT */}
        <main 
          className={`content-center ${isMobile && mobileView === 'center' ? 'mobile-active' : ''}`}
        >
          <Routes>
            <Route path="/" element={<CategoryList />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/:category/cluster/:clusterId" element={<ClusterPage />} />
            <Route path="/impressum" element={<Impressum />} />
          </Routes>
        </main>

        {/* RIGHT SIDEBAR */}
        <div 
          className={`sidebar-right ${isMobile && mobileView === 'right' ? 'mobile-active' : ''}`}
        >
          <div className="sidebar-right-content">
            <SearchSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    document.body.classList.add('hydrated');
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;