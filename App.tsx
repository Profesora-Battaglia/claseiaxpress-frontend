
import './styles.css';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { toolDetails } from './constants';
import { Tool } from './types';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load the page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChatBot = lazy(() => import('./pages/ChatBot'));
const GenericGenerator = lazy(() => import('./pages/GenericGenerator'));
const Login = lazy(() => import('./pages/Login'));
const History = lazy(() => import('./pages/History'));
const GuiaUsuario = lazy(() => import('./pages/GuiaUsuario'));

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    useEffect(() => {
        if (isLoggedIn && location.pathname === '/') {
            navigate('/dashboard');
        }
    }, [isLoggedIn, location.pathname, navigate]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => {
            setToast({ message: '', visible: false });
        }, 3000);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        navigate('/dashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/');
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-base-200 dark:bg-base-dark-200 font-sans">
            <Sidebar onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative bg-base-100 dark:bg-base-dark-100">
                <Suspense fallback={<div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/chatbot" element={<ChatBot />} />
                        <Route path="/history" element={<History showToast={showToast} />} />
                        <Route path="/guia-de-usuario" element={<GuiaUsuario />} />
                        <Route path="/generator/:tool" element={<GenericGeneratorWrapper showToast={showToast} />} />
                    </Routes>
                </Suspense>
                <Toast message={toast.message} visible={toast.visible} />
            </main>
        </div>
    );
};

const GenericGeneratorWrapper: React.FC<{ showToast: (message: string) => void }> = ({ showToast }) => {
    const { tool } = useParams<{ tool: keyof typeof Tool }>();
    if (!tool || !toolDetails[tool]) {
        return <div>Herramienta no encontrada</div>;
    }
    return <GenericGenerator tool={toolDetails[tool]} showToast={showToast} />;
};

export default App;