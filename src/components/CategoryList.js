import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { timeDifference } from '../utils/timeUtils';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        console.log('Fetching categories...');
        axios.get(`${process.env.REACT_APP_API_URL}/categories`)
            .then(response => {
                console.log('Categories fetched:', response.data);
                setCategories(response.data);
                fetchAllCategoryData(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setLoading(false);
            });
    }, []);

    const fetchAllCategoryData = async (categoryList) => {
        const categoryDataMap = {};
        let completed = 0;

        // Fetch all categories simultaneously
        const promises = categoryList.map(async (category) => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/${category}`);
                const sortedClusters = Object.entries(response.data).slice(0, 3);
                categoryDataMap[category] = sortedClusters;
                
                completed++;
                setLoadingProgress(Math.round((completed / categoryList.length) * 100));
                
                return { category, data: sortedClusters };
            } catch (error) {
                console.error(`Error fetching data for category ${category}:`, error);
                categoryDataMap[category] = [];
                completed++;
                setLoadingProgress(Math.round((completed / categoryList.length) * 100));
                return { category, data: [] };
            }
        });

        // Wait for ALL categories to complete
        await Promise.all(promises);
        
        // Now set all data at once and stop loading
        setCategoryData(categoryDataMap);
        setLoading(false);
    };

    const limitSummary = (summary) => {
        return summary.split(' ').slice(0, 40).join(' ') + '...';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
            </div>
        );
    }

    return (
        <div className="categories">
            {categories.length === 0 ? (
                <p>No categories available</p>
            ) : (
                categories.map(category => (
                    <CategoryPreview 
                        key={category} 
                        category={category} 
                        topClusters={categoryData[category] || []}
                        limitSummary={limitSummary} 
                    />
                ))
            )}
        </div>
    );
};

const CategoryPreview = ({ category, topClusters, limitSummary }) => {
    return (
        <div className="category-preview">
            <h2><Link to={`/category/${category}`}>{category}</Link></h2>
            <ul>
                {topClusters.map(([clusterId, clusterData]) => (
                    <li key={clusterId} className="news-cluster">
                        <div className="cluster-header">
                            {clusterData.articles[0].image_url && (
                                <img 
                                    src={clusterData.articles[0].image_url} 
                                    referrerPolicy="no-referrer" 
                                    alt="" 
                                    className="article-image" 
                                    onError={(e) => { e.target.src = "/fallback.jpg"; }} 
                                />
                            )}
                            <div className="article-details">
                                <a href={clusterData.articles[0].link} target="_blank" rel="noopener noreferrer">
                                    <h3 className="article-title">{clusterData.articles[0].title} - {clusterData.articles[0].portal}</h3>
                                </a>
                                <p className="time-portal">{`${timeDifference(clusterData.articles[0].fetch_date)} - ${clusterData.articles[0].portal}`}</p>
                                <p>{limitSummary(clusterData.articles[0].summary)}</p>
                            </div>
                        </div>
                        <div className="links-column">
                            {clusterData.articles.slice(1, 3).map(article => (
                                <a key={article.link} href={article.link} target="_blank" rel="noopener noreferrer" className="portal-link separate-link">
                                    {article.title} - {article.portal}
                                </a>
                            ))}
                        </div>
                        <div className="links-row">
                            {clusterData.articles.slice(6, 10).map(article => (
                                <a key={article.link} href={article.link} target="_blank" rel="noopener noreferrer" className="portal-link">
                                    {article.portal}
                                </a>
                            ))}
                            {clusterData.articles.length > 10 && <span>...</span>}
                            {clusterData.articles.length >= 4 && (
                                <Link to={`/category/${category}/cluster/${clusterId}`} className="view-all-link">
                                    Te gjitha lajmet
                                </Link>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;