import React from 'react';
import { Link } from 'react-router-dom';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose, categories }) => {
  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <ul className="menu-links">
        <li><Link to="/category/Kryesore" onClick={onClose}>Kryesore</Link></li>
        {categories
          .filter((category) => category !== 'Kryesore')
          .map((category) => (
            <li key={category}>
              <Link to={`/category/${category}`} onClick={onClose}>{category}</Link>
            </li>
        ))}
        <li><Link to="/impressum" onClick={onClose}>Rreth nesh</Link></li>
      </ul>
    </div>
  );
};


export default MobileMenu;
