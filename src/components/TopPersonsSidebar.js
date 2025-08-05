import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PersonSidebar.css'; // reuse same styles

const WordCloud = ({ persons, onPersonSelect, selectedPerson }) => {
  const personsList = Object.entries(persons);
  
  // Calculate font sizes based on article counts
  const getPersonStyle = (personName, count, maxCount, minCount) => {
    const minSize = 12;
    const maxSize = 28;
    const normalizedSize = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    
    return {
      fontSize: `${normalizedSize}px`,
      fontWeight: count > (maxCount * 0.7) ? 'bold' : count > (maxCount * 0.4) ? '600' : 'normal',
      color: `hsl(${210 + (count / maxCount) * 60}, 70%, ${60 - (count / maxCount) * 20}%)`,
      margin: '4px 8px',
      padding: '4px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'inline-block',
      transition: 'all 0.2s ease',
      border: selectedPerson === personName ? '2px solid #007bff' : '1px solid transparent',
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
          title={`${personData.count} articles`}
        >
          {personName}
        </span>
      ))}
    </div>
  );
};

const TopPersonsSidebar = ({ onPersonSelect, selectedPerson, selectedPersonData, onPersonClose }) => {
  const [topPersons, setTopPersons] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/persons/top/10`)
      .then((response) => setTopPersons(response.data))
      .catch((error) => console.error('Failed to load top persons:', error))
      .finally(() => setLoading(false));
  }, []);

  const personList = Object.entries(topPersons);

  return (
    <div className="person-sidebar">
      <div className="sidebar-header">
        {!selectedPerson ? (
          <>
            <h3>Top Personat dhe ngjarjet (Të gjitha kategoritë)</h3>
            <span className="person-count">({personList.length})</span>
          </>
        ) : (
          <div className="selected-person-header">
            <h3>{selectedPerson}</h3>
            <button className="close-button" onClick={onPersonClose} title="Close">×</button>
          </div>
        )}
      </div>

      {!selectedPerson ? (
        loading ? (
          <div className="loading">Loading top persons...</div>
        ) : (
          <WordCloud 
            persons={topPersons} 
            onPersonSelect={onPersonSelect}
            selectedPerson={selectedPerson}
          />
        )
      ) : (
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

export default TopPersonsSidebar;