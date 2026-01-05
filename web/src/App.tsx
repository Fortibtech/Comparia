import { useState } from 'react'
import './App.css'

// Types
type Offer = {
  vendor: string;
  price: number;
  url: string;
};

type Product = {
  id: string;
  title: string;
  bestPrice: number;
  currency: string;
  imageUrl: string;
  offers: Offer[];
  vendorCount: number;
};

// Popular search suggestions
const SEARCH_SUGGESTIONS = [
  'écouteurs', 'écouteurs bluetooth', 'enceinte bluetooth', 'enceinte',
  'iPhone', 'iPhone 14', 'iPhone 15', 'iPad', 'iMac', 'MacBook',
  'casque audio', 'casque gaming', 'casque bluetooth',
  'télévision', 'TV Samsung', 'TV 4K',
  'airpods', 'AirPods Pro',
  'montre connectée', 'Apple Watch',
  'smartphone', 'smartphone Samsung', 'Samsung Galaxy',
  'ordinateur portable', 'PC portable',
  'tablette', 'tablette Samsung',
  'console', 'PS5', 'PlayStation 5', 'Xbox', 'Nintendo Switch',
  'clavier', 'souris', 'souris gaming',
  'imprimante', 'webcam', 'microphone'
];

// Mock API for demo
const searchProducts = async (_q: string): Promise<Product[]> => {
  return new Promise(resolve => setTimeout(() => {
    resolve([
      {
        id: '1',
        title: 'Sony WH-1000XM5 Casque sans fil',
        bestPrice: 299.99,
        currency: 'EUR',
        imageUrl: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_UF894,1000_QL80_.jpg',
        vendorCount: 3,
        offers: [
          { vendor: 'Amazon', price: 349.00, url: 'https://amazon.com' },
          { vendor: 'Cdiscount', price: 299.99, url: 'https://cdiscount.com' },
          { vendor: 'Fnac', price: 329.99, url: 'https://fnac.com' }
        ]
      },
      {
        id: '2',
        title: 'Apple iPhone 14 (128 Go) - Minuit',
        bestPrice: 749.00,
        currency: 'EUR',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-midnight?wid=2560&hei=1440&fmt=p-jpg',
        vendorCount: 5,
        offers: [
          { vendor: 'Amazon', price: 749.00, url: 'https://amazon.com' },
          { vendor: 'Rakuten', price: 755.00, url: 'https://rakuten.com' }
        ]
      }
    ]);
  }, 1200));
};

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Remove accents from text for search
  const removeAccents = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Filter suggestions based on query - updates continuously as user types
  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (text.length >= 1) {
      const searchText = removeAccents(text.toLowerCase());
      const filtered = SEARCH_SUGGESTIONS.filter(s =>
        removeAccents(s.toLowerCase()).includes(searchText)
      );
      setFilteredSuggestions(filtered.slice(0, 6));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearchWithQuery(suggestion);
  };

  const handleSearchWithQuery = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);
    try {
      const data = await searchProducts(searchQuery);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await handleSearchWithQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const isCentered = !hasSearched && results.length === 0;

  return (
    <div className={`app-container ${isCentered ? 'centered' : 'top-aligned'}`}>
      {/* Search Section */}
      <div className="search-section">
        {/* Logo */}
        <h1 className={`logo ${isCentered ? 'logo-large' : 'logo-small'}`}>
          <span style={{ color: '#4285F4' }}>C</span>
          <span style={{ color: '#DB4437' }}>o</span>
          <span style={{ color: '#F4B400' }}>m</span>
          <span style={{ color: '#4285F4' }}>p</span>
          <span style={{ color: '#0F9D58' }}>a</span>
          <span style={{ color: '#DB4437' }}>r</span>
          <span style={{ color: '#4285F4' }}>i</span>
          <span style={{ color: '#F4B400' }}>o</span>
        </h1>

        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <div className="search-bar">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher un produit..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query.length > 0 && (
              <button
                className="clear-btn"
                onClick={() => { setQuery(''); setShowSuggestions(false); }}
              >
                ×
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="suggestions-dropdown">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <svg className="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vendors Row - Only in centered mode */}
        {isCentered && (
          <div className="vendors-section">
            <p className="vendors-title">Comparés en temps réel :</p>
            <div className="vendors-row">
              <div className="vendor-circle">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" />
              </div>
              <div className="vendor-circle">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Cdiscount_logo.svg/1200px-Cdiscount_logo.svg.png" alt="Cdiscount" />
              </div>
              <div className="vendor-circle">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Fnac_Logo.svg/1200px-Fnac_Logo.svg.png" alt="Fnac" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {!isCentered && (
        <div className="results-section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Recherche multi-boutiques...</p>
            </div>
          ) : (
            <div className="results-list">
              {results.length === 0 ? (
                <p className="no-results">Aucun résultat trouvé pour "{query}"</p>
              ) : (
                results.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="card-header">
                      <span className="best-price-badge">
                        Meilleur: {product.bestPrice} {product.currency}
                      </span>
                      <button
                        className="fav-btn"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        {favorites.includes(product.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <div className="card-body">
                      <img src={product.imageUrl} alt={product.title} className="product-image" />
                      <div className="product-info">
                        <h3 className="product-title">{product.title}</h3>
                        <p className="vendor-count">{product.vendorCount} marchands comparés</p>
                        <div className="offers-row">
                          {product.offers.slice(0, 2).map((offer, idx) => (
                            <a
                              key={idx}
                              href={offer.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`offer-btn ${offer.price === product.bestPrice ? 'best-offer' : ''}`}
                            >
                              {offer.vendor}: {offer.price}€
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
