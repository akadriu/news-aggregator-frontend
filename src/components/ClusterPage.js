import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { timeDifference } from '../utils/timeUtils';

const ClusterPage = () => {
    const { category, clusterId } = useParams();
    const navigate = useNavigate();
    const [clusterData, setClusterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        axios.get(`${process.env.REACT_APP_API_URL}/category/${category}/cluster/${clusterId}`)
            .then(response => {
                setClusterData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching cluster data:', error);
                setError(error);
                setLoading(false);
                
                // If cluster not found, redirect to category page after 3 seconds
                if (error.response && error.response.status === 404) {
                    setTimeout(() => {
                        navigate(`/category/${category}`);
                    }, 3000);
                }
            });
    }, [category, clusterId, navigate]);

    if (loading) return <div>Loading...</div>;
    
    if (error) {
        return (
            <div className="error-container">
                <h2>Ky grup nuk u gjet</h2>
                <p>Ky grup lajmesh nuk është më i disponueshëm. Do të ridrejtoheni në faqen e kategorisë {category} pas disa sekondash...</p>
                <p>
                    <a href={`/category/${category}`} onClick={(e) => {
                        e.preventDefault();
                        navigate(`/category/${category}`);
                    }}>
                        Klikoni këtu për t'u kthyer tani
                    </a>
                </p>
            </div>
        );
    }

    if (!clusterData || !clusterData.articles || clusterData.articles.length === 0) {
        return (
            <div className="error-container">
                <h2>Nuk u gjetën artikuj</h2>
                <p>Ky klaster nuk përmban asnjë artikull</p>
                <a href={`/category/${category}`} onClick={(e) => {
                    e.preventDefault();
                    navigate(`/category/${category}`);
                }}>
                    Back to {category}
                </a>
            </div>
        );
    }

    const firstArticleTitle = clusterData.articles[0].title;

    return (
        <div className="cluster-page-container">
            <h1>{firstArticleTitle} in {category}</h1>
            <ul className="article-list">
                {clusterData.articles.map((article) => (
                    <li key={article.link} className="article-item">
                        <div className="cluster-header">
                            {article.image_url && (
                                <img src={article.image_url} referrerPolicy="no-referrer" alt="" className="article-image" onError={(e) => { e.target.src = "/fallback.jpg"; }} />
                            )}
                            <div className="article-details">
                                <a href={article.link} target="_blank" rel="noopener noreferrer">
                                    <h3 className="article-title">{article.title}</h3>
                                </a>
                                <p className="time-portal">{`Para ${timeDifference(article.fetch_date)} - ${article.portal}`}</p>
                                <p>{article.summary.split(' ').slice(0, 80).join(' ') + '...'}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClusterPage;