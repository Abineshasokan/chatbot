
import React, { useState } from 'react';
import ChatApp from './ChatApp';
import AuthPage from './components/auth/AuthPage';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        // In a real app, you'd perform authentication here.
        // For this demo, we'll just set the state.
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <>
            {isAuthenticated ? (
                <ChatApp onLogout={handleLogout} />
            ) : (
                <AuthPage onLogin={handleLogin} />
            )}
        </>
    );
};

export default App;
