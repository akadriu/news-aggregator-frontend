import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PersonSidebar.css';

const PersonSidebar = ({ category, onPersonSelect, selectedPerson, selectedPersonData, onPersonClose }) => {
  const [persons, setPersons] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      fetchPersonsForCategory(category);
    }
  }, [category]);

  const fetchPersonsForCategory = async (categoryName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/persons/category/${categoryName}`);
      setPersons(response.data);
    } catch (error) {
      console.error('Error fetching persons:', error);
      setError('Failed to load persons');
      setPersons({});
    } finally {
      setLoading(false);
    }
  };

  const personsList = Object.entries(persons);

  return (
    <div className="person-sidebar">
      <div className="sidebar-header">
        {!selectedPerson ? (
          <>
            <h3>Persona dhe ngjarje në {category}</h3>
            <span className="person-count">({personsList.length} persons)</span>
          </>
        ) : (
          <div className="selected-person-header">
            <h3>{selectedPerson}</h3>
            <button className="close-button" onClick={onPersonClose} title="Close">×</button>
          </div>
        )}
      </div>

      {/* If no person selected, show list */}
      {!selectedPerson ? (
        loading ? (
          <div className="loading">Loading persons...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : personsList.length === 0 ? (
          <div className="no-persons">No persons found in this category</div>
        ) : (
          <div className="persons-list">
            {personsList.map(([personName, personData]) => (
              <div
                key={personName}
                className={`person-item ${selectedPerson === personName ? 'selected' : ''}`}
                onClick={() => onPersonSelect(personName, personData)}
              >
                <div className="person-name">{personName}</div>
                <div className="person-stats">
                  <span className="article-count">{personData.count} articles</span>
                  {personData.total_count > personData.count && (
                    <span className="total-count">({personData.total_count} total)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // When a person is selected, show their articles
        <div className="articles-list">
          {selectedPersonData.articles.map((article, index) => (
            <div key={index} className="article-item">
              <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
              <div className="article-meta">
                <span>{new URL(article.link).hostname.replace('www.', '')}</span> • 
                <span>{new Date(article.published_date).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonSidebar;
