import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PersonSidebar.css'; // reuse same styles

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
          <div className="persons-list">
            {personList.map(([personName, personData]) => (
              <div
                key={personName}
                className={`person-item ${selectedPerson === personName ? 'selected' : ''}`}
                onClick={() => onPersonSelect(personName, personData)}
              >
                <div className="person-name">{personName}</div>
                <div className="person-stats">
                  <span className="article-count">{personData.count} articles</span>
                </div>
              </div>
            ))}
          </div>
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
