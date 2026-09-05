import { useState } from 'react';
import './Home.css';

const airportsList = [
    { code: 'MIL', label: 'Milano (Tutti gli aeroporti)' },
    { code: 'FCO', label: 'Roma (Fiumicino)' },
    { code: 'NAP', label: 'Napoli (Capodichino)' },
    { code: 'BLQ', label: 'Bologna (Guglielmo Marconi)' }
];

const Home = () => {
    const [origin, setOrigin] = useState('MIL');
    const [originSearch, setOriginSearch] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [month, setMonth] = useState(8);
    const [nights, setNights] = useState(4);
    const [maxBudget, setMaxBudget] = useState(600);
    const [category, setCategory] = useState('Tutte');

    const [destinations, setDestinations] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const filteredAirports = airportsList.filter(airport =>
        airport.label.toLowerCase().includes(originSearch.toLowerCase()) ||
        airport.code.toLowerCase().includes(originSearch.toLowerCase())
    );

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setHasSearched(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/searchDestinations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // using parse because variables from html forms are strings by default
                body: JSON.stringify({
                    origin: origin,
                    month: parseInt(month),
                    nights: parseInt(nights),
                    maxBudget: parseFloat(maxBudget),
                    category: category === 'Tutte' ? null : category
                })
            });

            const data = await response.json();

            if (data.success) {
                setDestinations(data.data);
            } else {
                setErrorMsg(data.message || "Server error: matching destinations failed.");
            }
        } catch (error) {
            setErrorMsg("Server connection error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">

            <div className="search-hero">
                <h1 style={{marginBottom: '0'}}>Welcome to TripMatcher</h1>
                <p style={{ fontSize: '1.0rem', color: '#555'}}>Let's start to plan your dream's travel</p>

                <form className="search-form" onSubmit={handleSearch}>

                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Departure from</label>
                        <input
                            type="text"
                            value={originSearch}
                            onChange={(e) => {
                                setOriginSearch(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => {
                                setIsDropdownOpen(true);
                                setOriginSearch('');
                            }}
                            // The timeout allows time for the click on the list item (li) to register before the list disappears.                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                            placeholder="Search for an airport..."
                            required
                        />
                        {isDropdownOpen && (
                            <ul style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                zIndex: 10,
                                listStyle: 'none',
                                padding: 0,
                                margin: '5px 0 0 0',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                {filteredAirports.length > 0 ? (
                                    filteredAirports.map(airport => (
                                        <li
                                            key={airport.code}
                                            onClick={() => {
                                                setOrigin(airport.code);
                                                setOriginSearch(airport.label);
                                                setIsDropdownOpen(false);
                                            }}
                                            style={{
                                                padding: '10px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #f0f0f0',
                                                color: '#333',
                                                textAlign: 'left'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                        >
                                            {airport.label} <strong>({airport.code})</strong>
                                        </li>
                                    ))
                                ) : (
                                    <li style={{ padding: '10px', color: '#999' }}>No airport found</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Month</label>
                        <select value={month} onChange={(e) => setMonth(e.target.value)}>
                            <option value={1}>January</option>
                            <option value={2}>February</option>
                            <option value={3}>March</option>
                            <option value={4}>April</option>
                            <option value={5}>May</option>
                            <option value={6}>June</option>
                            <option value={7}>July</option>
                            <option value={8}>August</option>
                            <option value={9}>September</option>
                            <option value={10}>October</option>
                            <option value={11}>November</option>
                            <option value={12}>December</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Nights (double room)</label>
                        <input type="number" min="1" value={nights} onChange={(e) => setNights(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Total Budget x1 (€)</label>
                        <input type="number" min="50" step="50" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Tutte">Tutte</option>
                            <option value="mare">Mare</option>
                            <option value="montagna">Montagna</option>
                            <option value="citta">Città</option>
                        </select>
                    </div>

                    <button type="submit" className="form-submit-btn" disabled={loading}>
                        {loading ? 'Search in progress...' : 'Search'}
                    </button>
                </form>
            </div>

            {/* Results section (Cards) */}
            <div className="results-section">
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}

                {hasSearched && !loading && destinations.length === 0 && (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        No destinations found for this budget. Try increasing it!
                    </p>
                )}

                <div className="destinations-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '30px', justifyContent: 'center' }}>
                    {destinations.map((dest) => (
                        <div key={dest.id} className="destination-card" style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', width: '300px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                            <img src={dest.imageUrl} alt={dest.city} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                            <h3>{dest.city}</h3>
                            <p><em>{dest.category.toUpperCase()}</em></p>
                            <p>{dest.description}</p>
                            <hr />
                            <h4 style={{ color: '#2ecc71' }}>Starting from: {dest.totalEstimatedCost} €</h4>
                            <p style={{ fontSize: '0.85em', color: '#666' }}>(Volo: {dest.avgFlight}€ + Hotel: {dest.avgAccomodation}€ a notte)</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;