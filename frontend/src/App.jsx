import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

//Importing pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
    return (
        <div className="app-container">

            {/* NAVBAR */}
            <nav className="navbar">
                <div>
                    <Link to="/" className="nav-brand">TripMatcher</Link>
                </div>
                <div>
                    <Link to="/login" className="nav-login-btn">Accedi</Link>
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