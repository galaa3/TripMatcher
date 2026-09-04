import { useState } from 'react';
import './Home.css';

const Home = () => {
    const [month, setMonth] = useState(8);
    const [nights, setNights] = useState(4);
    const [maxBudget, setMaxBudget] = useState(600);
    const [category, setCategory] = useState('Tutte');

    const [destinations, setDestinations] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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
                    <div className="form-group">
                        <label>Month</label>
                        <select value={month} onChange={(e) => setMonth(e.target.value)}>
                            <option value={6}>Giugno</option>
                            <option value={7}>Luglio</option>
                            <option value={8}>Agosto</option>
                            <option value={9}>Settembre</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Nights</label>
                        <input type="number" min="1" value={nights} onChange={(e) => setNights(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Total Budget (€)</label>
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
                        {loading ? 'Ricerca in corso...' : 'Cerca Destinazioni'}
                    </button>
                </form>
            </div>

            {/* Sezione Risultati (Cards) */}
            <div className="results-section">
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}

                {hasSearched && !loading && destinations.length === 0 && (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        Nessuna destinazione trovata per questo budget. Prova ad alzarlo!
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