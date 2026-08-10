import { Link } from 'react-router-dom';

const SignUp = () => {
    return (
        <div className="form-container">
            <h2>Signup</h2>
            <p style={{textAlign: 'center', marginBottom: '20px'}}>Qui costruiremo il form a tre campi.</p>

            <div className="form-footer" style={{marginTop: '0'}}>
                <Link to="/login" className="form-link">Torna al Login</Link>
            </div>
        </div>
    );
};

export default SignUp;