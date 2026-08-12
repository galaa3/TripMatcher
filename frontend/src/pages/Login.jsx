import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setErrorMsg('');

        try{
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if(data.success){
                // testing
                console.log("User from DB: ", data.user);

                navigate('/');
            }else{
                setErrorMsg(data.message);
            }
        }catch (error){
            setErrorMsg("Connection to server failed.");
        }
    }

    return (
        <div className="form-container">
            <h2>Login</h2>

            {errorMsg && (
                <div className="errorMsg">
                    {errorMsg}
                </div>
            )}

            <form className="auth-form" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="form-submit-btn">Login</button>
            </form>

            <div className="form-footer">
                Non hai ancora un account?{' '}
                <Link to="/signup" className="form-link">Sign up here</Link>
            </div>
        </div>
    );
};

export default Login;