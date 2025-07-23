import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';

const NavBar = () => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/categories`)
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-inner">
          <div className="nav-left">
            <button className="hamburger" onClick={toggleMenu}>☰</button>
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
            </ul>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} categories={categories} />
    </>
  );
};

export default NavBar;
