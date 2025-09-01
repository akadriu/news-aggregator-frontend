import React, { useState, useEffect } from 'react';

const SearchSidebar = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // NEW: advanced options
  const [portal, setPortal] = useState('');
  const [exactMatch, setExactMatch] = useState(false);
  const [limit, setLimit] = useState(''); // keep empty = no cap

  const [searchResults, setSearchResults] = useState([]);
  const [resultCount, setResultCount] = useState(0); // show server count
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Categories available for search (matching your navigation)
  const categories = [
    { value: '', label: 'Të gjitha kategoritë' },
    { value: 'Kosovë', label: 'Kosovë' },
    { value: 'Maqedoni', label: 'Maqedoni' },
    { value: 'Bota', label: 'Bota' },
    { value: 'Ekonomi', label: 'Ekonomi' },
    { value: 'Sport', label: 'Sport' },
    { value: 'Kulturë', label: 'Kulturë' },
    { value: 'Kronika', label: 'Kronika' },
    { value: 'Rozë', label: 'Rozë' }
  ];

  // Category normalization (aligns with backend)
  const normalizeCategory = (category) => {
    const mapping = {
      "Kosovë": "Kosovë",
      "Kosove": "Kosovë",
      "Rozë": "Rozë",
      "Roze": "Rozë",
      "Kulturë": "Kulturë",
      "Kultura": "Kulturë"
    };
    return mapping[category] || category;
  };

  // Search using the ADVANCED endpoint (works for simple searches too)
  const runSearch = async () => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setResultCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const base = process.env.REACT_APP_API_URL; // e.g. http://localhost:8000
      const params = new URLSearchParams({
        keyword: keyword.trim(),
        ...(selectedCategory && { category: normalizeCategory(selectedCategory) }),
        ...(portal.trim() && { portal: portal.trim() }),
        ...(exactMatch ? { exact_match: 'true' } : {}),
        ...(limit && !isNaN(Number(limit)) ? { limit: String(Number(limit)) } : {})
      });

      const response = await fetch(`${base}/api/search/advanced?${params}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results || []);
        setResultCount(Number(data.count ?? (data.results || []).length));
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Gabim gjatë kërkimit. Provoni përsëri.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced auto-search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (keyword.trim()) runSearch();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [keyword, selectedCategory, portal, exactMatch, limit]);

  const handleClearSearch = () => {
    setKeyword('');
    setSelectedCategory('');
    setPortal('');
    setExactMatch(false);
    setLimit('');
    setSearchResults([]);
    setResultCount(0);
    setError(null);
  };

  return (
    <div className="search-sidebar">
      <div className="search-container">
        <h4>Kërko Lajmet e Fundit</h4>

        {/* Keyword */}
        <div className="search-field">
          <input
            type="text"
            placeholder="Shkruani fjalën kyçe..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category */}
        <div className="search-field">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="search-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          className="clear-btn"
          onClick={() => setShowAdvanced(v => !v)}
          style={{ marginBottom: 8 }}
        >
          {showAdvanced ? 'Mbyll Opsionet e Avancuara' : 'Opsionet e Avancuara'}
        </button>

        {/* Advanced options */}
        {showAdvanced && (
          <div className="advanced-box" style={{ marginBottom: 8 }}>
            <div className="search-field">
              <input
                type="text"
                placeholder="Portal (p.sh. Gazeta Express)"
                value={portal}
                onChange={(e) => setPortal(e.target.value)}
                className="search-input"
              />
            </div>
            {/*
            <div className="search-field" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                id="exactMatch"
                type="checkbox"
                checked={exactMatch}
                onChange={(e) => setExactMatch(e.target.checked)}
              />
              <label htmlFor="exactMatch">Kërkim i saktë (exact match)</label>
            </div>
            */}
            <div className="search-field">
              <input
                type="number"
                min="1"
                placeholder="Limit (opsionale)"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        )}

        {/* Clear */}
        {(keyword || selectedCategory || portal || exactMatch || limit) && (
          <button onClick={handleClearSearch} className="clear-btn">Pastro</button>
        )}

        {/* Loading */}
        {isLoading && <div className="search-loading">Kërkoj...</div>}

        {/* Error */}
        {error && <div className="search-error">{error}</div>}

        {/* Results */}
        <div className="search-results">
          {resultCount > 0 && (
            <>
              <div className="results-header">Gjetur {resultCount} rezultate</div>
              {searchResults.map((result, index) => (
                <div key={index} className="search-result-item">
                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-link">
                    <div className="result-title">{result.title}</div>
                    <div className="result-portal">{result.portal}</div>
                    {result.summary && (
                      <div className="result-summary">
                        {result.summary.substring(0, 150)}...
                      </div>
                    )}
                  </a>
                </div>
              ))}
            </>
          )}

          {keyword.trim() && !isLoading && resultCount === 0 && !error && (
            <div className="no-results">
              Nuk u gjetën rezultate për "{keyword}"
              {selectedCategory && ` në kategorinë "${selectedCategory}"`}
              {portal && ` nga portali "${portal}"`}
              {exactMatch && ' (kërkim i saktë)'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSidebar;
