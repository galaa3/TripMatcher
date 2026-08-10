import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="form-container">
            <h2>Login</h2>

            <form className="auth-form">
                <input type="text" placeholder="Username" className="form-input" />
                <input type="password" placeholder="Password" className="form-input" />
                <button type="submit" className="form-submit-btn">Entra</button>
            </form>

            <div className="form-footer">
                Non hai ancora un account?{' '}
                <Link to="/signup" className="form-link">Registrati qui</Link>
            </div>
        </div>
    );
};

export default Login;