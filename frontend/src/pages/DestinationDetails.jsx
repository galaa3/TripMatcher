import { useLocation, useNavigate } from 'react-router-dom';
import './DestinationDetails.css';

const DestinationDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve the destination and origin passed from Home.jsx
    const { dest, origin } = location.state || {};

    if (!dest) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>No destination data found.</h2>
                <button onClick={() => navigate('/')}>Return to Search</button>
            </div>
        );
    }

    // Dynamic Deep Links Construction
    const skyscannerLink = `https://www.skyscanner.it/trasporti/voli/${origin}/${dest.iataCode}`;
    const bookingLink = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(dest.city)}`;
    const airbnbLink = `https://www.airbnb.com/s/${encodeURIComponent(dest.city)}/homes`;

    return (
        <div className="destination-detail-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                Back to Results
            </button>

            <img
                src={dest.imageUrl}
                alt={dest.city}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px' }}
            />

            <h1 style={{ fontSize: '2.5rem', marginTop: '20px' }}>{dest.city}</h1>

            <span style={{ backgroundColor: '#eee', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9rem' }}>
                {dest.category.toUpperCase()}
            </span>

            <p style={{ fontSize: '1.0rem', lineHeight: '1.6', marginTop: '20px', color: '#444' }}>
                {dest.description}
            </p>

            {/* Contenitore dei bottoni impilati verticalmente */}
            <div className="booking-actions">
                <a href={skyscannerLink} target="_blank" rel="noopener noreferrer" className="skyscanner-btn">
                    ✈️ Flights (Skyscanner)
                </a>

                <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="booking-btn">
                    🏨 Hotels (Booking.com)
                </a>

                <a href={airbnbLink} target="_blank" rel="noopener noreferrer" className="airbnb-btn">
                    🏠 Rentals (Airbnb)
                </a>
            </div>
        </div>
    );
};

export default DestinationDetail;