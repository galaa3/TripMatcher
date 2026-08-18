import { createContext, useContext, useState, useEffect } from 'react';

/**
 * handles session: checkSession (checks if there is a valid session for a specific
 * user calling CheckSession servlet), logout
 * @type {React.Context<null>}
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* On mount (e.g. after a page refresh) ask the server if a session
     * is already active, so the user doesn't have to log in again. */
    useEffect(() => {
        let ignore = false; // avoids setState after the component has unmounted

        const checkSession = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (!ignore && data.success) {
                    setUser(data.user);
                }
            } catch (error) {
                // server unreachable, or no active session: user stays null
                console.error('Session check failed:', error);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        void checkSession(); // reject handled with try-catch

        return () => {
            ignore = true;
        };
    }, []);

    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
