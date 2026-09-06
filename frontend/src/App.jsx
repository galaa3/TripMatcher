import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';

//Importing pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import DestinationDetail from './pages/DestinationDetails';

function App() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // We need it to know which page we're on.

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleLogoClick = (e) => {
        e.preventDefault(); // Blocca la navigazione standard del <Link>

        // 1. Elimina solo i dati di ricerca dal sessionStorage (lasciando intatti eventuali token di login)
        const keysToRemove = [
            'search_origin', 'search_originSearch', 'search_month',
            'search_nights', 'search_maxBudget', 'search_category',
            'search_destinations', 'search_hasSearched'
        ];
        keysToRemove.forEach(key => sessionStorage.removeItem(key));

        // 2. Naviga alla Home. Se ci siamo già, forza un refresh per resettare gli stati di React.
        if (location.pathname === '/') {
            window.location.reload();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="app-container">

            {/* NAVBAR */}
            <nav className="navbar">
                <div>
                    <Link to="/" onClick={handleLogoClick} className="nav-brand">TripMatcher</Link>
                </div>
                <div>
                    {loading ? null : user ? (
                        <>
                            <span style={{ marginRight: '15px' }}>Ciao, {user.username}</span>
                            <button onClick={handleLogout} className="nav-login-btn">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-login-btn">Login</Link>
                    )}
                </div>
            </nav>

            {/* DYNAMIC CONTENT */}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/destination/:id" element={<DestinationDetail />} />
                </Routes>
            </main>

        </div>
    );
}

export default App;