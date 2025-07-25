import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryList from './components/CategoryList';
import CategoryPage from './components/CategoryPage';
import ClusterPage from './components/ClusterPage';
import './App.css';
import NavBar from './components/NavBar';

function App() {
    // Removed the automatic page refresh that was causing issues
    // The data will still be fresh from the backend API calls
    
    return (
        <Router>
            <div>
                <NavBar />
                <div className="page-layout">
                    <div className="sidebar-left">
                        <div className="sidebar-left-content">Lorem ipsum dolor sit amet...</div>
                    </div>
                    <main className="content-center">
                        <Routes>
                            <Route path="/" element={<CategoryList />} />
                            <Route path="/category/:category" element={<CategoryPage />} />
                            <Route path="/category/:category/cluster/:clusterId" element={<ClusterPage />} />
                        </Routes>
                    </main>
                    <div className="sidebar-right">
                        <div className="sidebar-right-content">Lorem ipsum dolor sit amet...</div>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;