import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try{
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signup`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if(data.success){
                console.log("user added to db");

                navigate('/login');
            }else{
                setErrorMsg(data.message || "Sign up error.");
            }
        }catch (error){
            setErrorMsg("Sign up failed.");
        }

    }

    return (
        <div className="form-container">
            <h2>Signup</h2>

            {errorMsg && (
                <div className="errorMsg">
                    {errorMsg}
                </div>
            )}

            <form className="auth-form" onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="form-submit-btn">Signup</button>
            </form>

            <div className="form-footer" style={{marginTop: '0'}}>
                <Link to="/login" className="form-link">Torna al Login</Link>
            </div>
        </div>
    );
};

export default SignUp;