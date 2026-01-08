import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { timeDifference } from '../utils/timeUtils';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [topLajme, setTopLajme] = useState([]);
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

    // Calculate trending score based on article count and freshness
    // Freshness is weighted HEAVILY to prioritize breaking news
    const calculateTrendingScore = (clusterData) => {
        const articles = clusterData.articles || [];
        const articleCount = articles.length;
        
        if (articleCount === 0) return 0;

        // Calculate average freshness (in hours from now)
        const now = new Date();
        let totalFreshnessScore = 0;
        
        articles.forEach(article => {
            if (article.fetch_date) {
                const articleDate = new Date(article.fetch_date);
                const hoursAgo = (now - articleDate) / (1000 * 60 * 60);
                // Fresher articles get higher scores (inverse of hours ago)
                // Max freshness score is 36 (for very recent), min approaches 0
                const freshnessScore = Math.max(0, 36 - hoursAgo);
                totalFreshnessScore += freshnessScore;
            }
        });

        const avgFreshness = totalFreshnessScore / articleCount;
        
        // Combined score: freshness is dominant factor
        // Breaking news (minutes old) will always beat older stories
        const score = (avgFreshness * 10) + (articleCount * 3);
        
        return score;
    };

    const fetchAllCategoryData = async (categoryList) => {
        const categoryDataMap = {};
        const allClusters = []; // Collect all clusters for top lajme calculation
        let completed = 0;

        // Fetch all categories simultaneously
        const promises = categoryList.map(async (category) => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/category/${category}`);
                const clusters = response.data;
                
                // Store all clusters for this category
                categoryDataMap[category] = clusters;
                
                // Collect clusters with their category info for top lajme calculation
                Object.entries(clusters).forEach(([clusterId, clusterData]) => {
                    allClusters.push({
                        category,
                        clusterId,
                        clusterData,
                        trendingScore: calculateTrendingScore(clusterData)
                    });
                });
                
                completed++;
                setLoadingProgress(Math.round((completed / categoryList.length) * 100));
                
                return { category, data: clusters };
            } catch (error) {
                console.error(`Error fetching data for category ${category}:`, error);
                categoryDataMap[category] = {};
                completed++;
                setLoadingProgress(Math.round((completed / categoryList.length) * 100));
                return { category, data: {} };
            }
        });

        // Wait for ALL categories to complete
        await Promise.all(promises);
        
        // Sort all clusters by trending score and get top 4
        const sortedClusters = allClusters.sort((a, b) => b.trendingScore - a.trendingScore);
        const topClusters = sortedClusters.slice(0, 4);
        
        console.log('Top Lajme clusters:', topClusters.map(c => ({
            category: c.category,
            title: c.clusterData.articles[0]?.title,
            score: c.trendingScore,
            articleCount: c.clusterData.articles?.length
        })));
        
        // Create a set of top cluster IDs to exclude from category display
        const topClusterKeys = new Set(
            topClusters.map(c => `${c.category}-${c.clusterId}`)
        );
        
        // Filter category data to exclude top lajme clusters and limit to 3 per category
        const filteredCategoryData = {};
        Object.entries(categoryDataMap).forEach(([category, clusters]) => {
            const filteredClusters = Object.entries(clusters)
                .filter(([clusterId]) => !topClusterKeys.has(`${category}-${clusterId}`))
                .slice(0, 3);
            filteredCategoryData[category] = filteredClusters;
        });
        
        setTopLajme(topClusters);
        setCategoryData(filteredCategoryData);
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
            {/* TOP LAJME SECTION */}
            {topLajme.length > 0 && (
                <TopLajmeSection 
                    topLajme={topLajme} 
                    limitSummary={limitSummary} 
                />
            )}
            
            {/* CATEGORY SECTIONS */}
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

// Top Lajme section - same format as CategoryPreview
const TopLajmeSection = ({ topLajme, limitSummary }) => {
    return (
        <div className="category-preview">
            <h2><span style={{ color: '#cc0000', textDecoration: 'none' }}>Top Lajme</span></h2>
            <ul>
                {topLajme.map(({ category, clusterId, clusterData }) => (
                    <li key={`${category}-${clusterId}`} className="news-cluster">
                        <div className="cluster-header">
                            <img 
                                src={clusterData.articles[0].image_url || "/fallback.jpg"} 
                                referrerPolicy="no-referrer" 
                                alt="" 
                                className="article-image" 
                                onError={(e) => { e.target.src = "/fallback.jpg"; }} 
                            />
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

const CategoryPreview = ({ category, topClusters, limitSummary }) => {
    return (
        <div className="category-preview">
            <h2><Link to={`/category/${category}`}>{category}</Link></h2>
            <ul>
                {topClusters.map(([clusterId, clusterData]) => (
                    <li key={clusterId} className="news-cluster">
                        <div className="cluster-header">
                            <img 
                                src={clusterData.articles[0].image_url || "/fallback.jpg"} 
                                referrerPolicy="no-referrer" 
                                alt="" 
                                className="article-image" 
                                onError={(e) => { e.target.src = "/fallback.jpg"; }} 
                            />
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
