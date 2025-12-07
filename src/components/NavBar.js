import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';

const NavBar = () => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories`)
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  // Detect mobile / desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        // if we go to desktop, make sure menu is closed
        setIsMenuOpen(false);
      }
    };

    handleResize(); // run once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-inner">
          <div className="nav-left">
            {/* Hamburger only on mobile */}
            {isMobile && (
              <button className="hamburger" onClick={toggleMenu}>
                ☰
              </button>
            )}

            <Link to="/">
              <span className="logo-main">Lajm</span>
              <span className="logo-ai">AI</span>
            </Link>
          </div>

          <div className="nav-center">
            <ul>
              {categories.map(category => (
                <li key={category}>
                  <Link to={`/category/${category}`}>{category}</Link>
                </li>
              ))}

              <li>
                <Link to="/impressum">Rreth nesh</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile menu only rendered on mobile */}
      {isMobile && (
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          categories={categories}
        />
      )}
    </>
  );
};

export default NavBar;
