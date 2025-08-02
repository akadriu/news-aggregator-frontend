import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { timeDifference } from '../utils/timeUtils';
import { Link } from 'react-router-dom';

const CategoryPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [clusters, setClusters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        axios.get(`${process.env.REACT_APP_API_URL}/category/${category}`)
            .then(response => {
                if (response.data && typeof response.data === 'object') {
                    const sortedClusters = Object.entries(response.data);
                    setClusters(sortedClusters);
                } else {
                    setClusters([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error(`Error fetching data for category ${category}:`, error);
                setError(error);
                setLoading(false);
                
                // If category not found, redirect to home after 3 seconds
                if (error.response && error.response.status === 404) {
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            });
    }, [category, navigate]);

    const limitSummary = (summary) => {
        if (!summary) return '';
        return summary.split(' ').slice(0, 20).join(' ') + '...';
    };

    if (loading) return <div>Loading...</div>;
    
    if (error) {
        return (
            <div className="error-container">
                <h2>Category Not Found</h2>
                <p>The category "{category}" is not available. You will be redirected to the home page in a few seconds...</p>
                <p>
                    <a href="/" onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                    }}>
                        Click here to go back now
                    </a>
                </p>
            </div>
        );
    }

    if (clusters.length === 0) {
        return (
            <div className="category-page">
                <h1>{category}</h1>
                <p>No news clusters available in this category at the moment.</p>
                <Link to="/">← Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="category-page">
            <h1>{category}</h1>
            <ul>
                {clusters.map(([clusterId, clusterData]) => {
                    // Safety check for cluster data structure
                    if (!clusterData || !clusterData.articles || clusterData.articles.length === 0) {
                        return null; // Skip invalid clusters
                    }

                    const firstArticle = clusterData.articles[0];
                    
                    return (
                        <li key={clusterId} className="news-cluster">
                            <div className="cluster-header">
                                {firstArticle.image_url && (
                                    <img 
                                        src={firstArticle.image_url} 
                                        referrerPolicy="no-referrer" 
                                        alt="" 
                                        className="article-image" 
                                        onError={(e) => { e.target.src = "/fallback.jpg"; }} 
                                    />
                                )}
                                <div className="article-details">
                                    <a href={firstArticle.link} target="_blank" rel="noopener noreferrer" className="article-title">
                                        <h3>{firstArticle.title.split(' ').slice(0, 5).join(' ') + '...'} - {firstArticle.portal}</h3>
                                    </a>
                                    <p className="time-portal">{`Para ${timeDifference(firstArticle.fetch_date)} - ${firstArticle.portal}`}</p>
                                    <p>{limitSummary(firstArticle.summary)}</p>
                                </div>
                            </div>
                            <div className="links-column">
                                {clusterData.articles.slice(1, 3).map(article => (
                                    <a key={article.link} href={article.link} target="_blank" rel="noopener noreferrer" className="portal-link separate-link">
                                        {article.title.split(' ').slice(0, 6).join(' ') + '...'} - {article.portal}
                                    </a>
                                ))}
                            </div>
                            <div className="links-row">
                                {clusterData.articles.slice(5, 10).map(article => (
                                    <a key={article.link} href={article.link} target="_blank" rel="noopener noreferrer" className="portal-link">
                                        {article.portal}
                                    </a>
                                ))}
                                {clusterData.articles.length > 10 && <span>...</span>}
                                <Link to={`/category/${category}/cluster/${clusterId}`} className="view-all-link">Te gjitha lajmet</Link>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CategoryPage;