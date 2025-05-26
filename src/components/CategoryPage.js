import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { timeDifference } from '../utils/timeUtils';

const CategoryPage = () => {
    const { category } = useParams();
    const [clusters, setClusters] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/category/${category}`)
            .then(response => {
                const sortedClusters = Object.entries(response.data)
                setClusters(sortedClusters);
            })
            .catch(error => {
                console.error(`Error fetching data for category ${category}:`, error);
            });
    }, [category]);

    const limitSummary = (summary) => {
        return summary.split(' ').slice(0, 100).join(' ') + '...';
    };

    return (
        <div className="category-page">
            <h1>{category}</h1>
            <ul>
                {clusters.map(([clusterId, clusterData]) => (
                    <li key={clusterId} className="news-cluster">
                        <div className="cluster-header">
                            {clusterData.articles[0].image_url && (
                                <img src={clusterData.articles[0].image_url} alt="" className="article-image" onError={(e) => { e.target.src = "/fallback.jpg"; }} />
                            )}
                            <div className="article-details">
                                <a href={clusterData.articles[0].link} target="_blank" rel="noopener noreferrer" className="article-title">
                                    <h3>{clusterData.articles[0].title}</h3>
                                </a>
                                <p className="time-portal">{`Para ${timeDifference(clusterData.articles[0].fetch_date)} - ${clusterData.articles[0].portal}`}</p>
                                <p>{limitSummary(clusterData.articles[0].summary)}</p>
                            </div>
                        </div>
                        <div className="links-column">
                            {clusterData.articles.slice(1, 5).map(article => (
                                <a key={article.link} href={article.link} target="_blank" rel="noopener noreferrer" className="portal-link separate-link">
                                    {article.title}
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
                            <a href={`/category/${category}/cluster/${clusterId}`} className="view-all-link">Te gjitha lajmet</a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryPage;
