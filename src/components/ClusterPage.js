import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { timeDifference } from '../utils/timeUtils';

const ClusterPage = () => {
    const { category, clusterId } = useParams();
    const [clusterData, setClusterData] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/category/${category}/cluster/${clusterId}`)
            .then(response => {
                setClusterData(response.data);
            })
            .catch(error => {
                console.error('Error fetching cluster data:', error);
            });
    }, [category, clusterId]);

    if (!clusterData) return <div>Loading...</div>;

    const firstArticleTitle = clusterData.articles.length > 0 ? clusterData.articles[0].title : 'No Title';

    return (
        <div className="cluster-page-container">
            <h1>{firstArticleTitle} in {category}</h1>
            <ul className="article-list">
                {clusterData.articles.map((article) => (
                    <li key={article.link} className="article-item">
                        <div className="cluster-header">
                            {article.image_url && (
                                <img src={article.image_url} alt="" className="article-image" onError={(e) => { e.target.src = "/fallback.jpg"; }} />
                            )}
                            <div className="article-details">
                                <a href={article.link} target="_blank" rel="noopener noreferrer" className="article-title">
                                    <h3>{article.title}</h3>
                                </a>
                                <p className="time-portal">{`Para ${timeDifference(article.fetch_date)} - ${article.portal}`}</p>
                                <p>{article.summary.split(' ').slice(0, 100).join(' ') + '...'}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClusterPage;