import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PersonSidebar.css';

const WordCloud = ({ persons, onPersonSelect, selectedPerson }) => {
  // Sort persons by count in descending order
  const personsList = Object.entries(persons).sort(([, a], [, b]) => b.count - a.count);
  
  // Calculate font sizes based on article counts
  const getPersonStyle = (personName, count, maxCount, minCount) => {
    const minSize = 12;
    const maxSize = 28;
    const normalizedSize = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    
    return {
      fontSize: `${normalizedSize}px`,
      fontWeight: count > (maxCount * 0.7) ? 'bold' : count > (maxCount * 0.4) ? '600' : 'normal',
      color: `hsl(0, 0%, ${10 + (1 - (count / maxCount)) * 60}%)`,
      margin: '4px 8px',
      padding: '4px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'inline-block',
      transition: 'all 0.2s ease',
      border: selectedPerson === personName ? '2px solid #9ba0a7ff' : '1px solid transparent',
      backgroundColor: selectedPerson === personName ? 'rgba(0, 123, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
    };
  };

  if (personsList.length === 0) return null;

  const counts = personsList.map(([_, data]) => data.count);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);

  return (
    <div className="word-cloud-container">
      {personsList.map(([personName, personData]) => (
        <span
          key={personName}
          className="word-cloud-item"
          style={getPersonStyle(personName, personData.count, maxCount, minCount)}
          onClick={() => onPersonSelect(personName, personData)}
          title={`${personData.count} articles${personData.total_count > personData.count ? ` (${personData.total_count} total)` : ''}`}
        >
          {personName}
        </span>
      ))}
    </div>
  );
};

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

  // Sort persons by count for the empty state check
  const personsList = Object.entries(persons).sort(([, a], [, b]) => b.count - a.count);

  return (
    <div className="sidebar-left-content person-sidebar">
      <div className="sidebar-header">
        {!selectedPerson ? (
          <>
            <h3>Persona dhe entitete në {category}</h3>
          </>
        ) : (
          <div className="selected-person-header">
            <h3>{selectedPerson}</h3>
            <button className="close-button" onClick={onPersonClose} title="Close">×</button>
          </div>
        )}
      </div>

      {/* If no person selected, show word cloud */}
      {!selectedPerson ? (
        loading ? (
          <div className="loading">Loading persons...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : personsList.length === 0 ? (
          <div className="no-persons">Nuk ka persona</div>
        ) : (
          <WordCloud 
            persons={persons} 
            onPersonSelect={onPersonSelect}
            selectedPerson={selectedPerson}
          />
        )
      ) : (
        // When a person is selected, show their articles
        <div className="articles-list">
          {selectedPersonData.articles.map((article, index) => (
            <div key={index} className="article-item">
              <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a>
              <div className="article-meta">
                <span>{new URL(article.link).hostname.replace('www.', '')}</span><br />
                <span>
                  {new Date(article.published_date)
                    .toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true // keep AM/PM
                    })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonSidebar;