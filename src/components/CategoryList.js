import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { timeDifference } from '../utils/timeUtils';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        console.log('Fetching categories...');
        axios.get(`${process.env.REACT_APP_API_URL}/categories`)
            .then(response => {
                console.log('Categories fetched:', response.data);
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const limitSummary = (summary) => {
            return summary.split(' ').slice(0, 100).join(' ') + '...';
    };

    return (
        <div className="categories">
            {categories.length === 0 ? (
                <p>No categories available</p>
            ) : (
                categories.map(category => (
                <CategoryPreview key={category} category={category} limitSummary={limitSummary} />
                ))
            )}
        </div>

    );
};

const CategoryPreview = ({ category, limitSummary }) => {
    const [topClusters, setTopClusters] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/category/${category}`)
            .then(response => {
                const sortedClusters = Object.entries(response.data)
                    .slice(0, 3);  // Take only the top 3 clusters
                setTopClusters(sortedClusters);
            })
            .catch(error => {
                console.error(`Error fetching data for category ${category}:`, error);
            });
    }, [category]);

    return (
        <div className="category-preview">
            <h2><Link to={`/category/${category}`}>{category}</Link></h2>
            <ul>
                {topClusters.map(([clusterId, clusterData]) => (
                    <li key={clusterId} className="news-cluster">
                        <div className="cluster-header">
                            {clusterData.articles[0].image_url && (
                                <img src={clusterData.articles[0].image_url} referrerPolicy="no-referrer" alt="" className="article-image" onError={(e) => { e.target.src = "/fallback.jpg"; }} />
                            )}
                            <div className="article-details">
                                <a href={clusterData.articles[0].link} target="_blank" rel="noopener noreferrer" className="article-title">
                                    <h3>    {clusterData.articles[0].title.split(' ').slice(0, 8).join(' ') + '...'} - {clusterData.articles[0].portal}</h3>
                                </a>
                                <p className="time-portal">{`Para ${timeDifference(clusterData.articles[0].fetch_date)} - ${clusterData.articles[0].portal}`}</p>
                                <p>{limitSummary(clusterData.articles[0].summary)}</p>
                            </div>
                        </div>
                        <div className="links-column">
                            {clusterData.articles.slice(1, 3).map(article => (  // Start from the second article
                                <a key={article.link} href={article.link} target="_blank" rel="noopener noreferrer" className="portal-link separate-link">
                                    {article.title.split(' ').slice(0, 6).join(' ') + '...'} - {article.portal}
                                </a>
                            ))}
                        </div>
                        <div className="links-row">
                            {clusterData.articles.slice(6, 10).map(article => (  // Continue with the next set of articles
                                <a key={article.link} href={article.link} target="_blank" rel="noopener noreferrer" className="portal-link">
                                    {article.portal}
                                </a>
                            ))}
                            {clusterData.articles.length > 10 && <span>...</span>}
                            <Link to={`/category/${category}/cluster/${clusterId}`} className="view-all-link">Te gjitha lajmet</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
