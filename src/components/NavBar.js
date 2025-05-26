import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    return (
        <nav className="nav-bar">
            <div className="nav-left">
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
        </nav>
    );
};

export default NavBar;
