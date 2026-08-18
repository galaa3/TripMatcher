import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';

//Importing pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';

function App() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="app-container">

            {/* NAVBAR */}
            <nav className="navbar">
                <div>
                    <Link to="/" className="nav-brand">TripMatcher</Link>
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
                </Routes>
            </main>

        </div>
    );
}

export default App;