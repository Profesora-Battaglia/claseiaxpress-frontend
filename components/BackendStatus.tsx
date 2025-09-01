import React, { useState, useEffect } from 'react';

interface BackendStatusProps {
    className?: string;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ className = '' }) => {
    const [status, setStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        checkBackendStatus();
    }, []);

    const checkBackendStatus = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: 'test connection' }),
            });

            if (response.ok) {
                setStatus('online');
                setErrorMessage('');
            } else {
                const errorText = await response.text();
                setStatus('error');
                setErrorMessage(errorText);
            }
        } catch (error) {
            setStatus('offline');
            setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'online': return 'text-green-600 dark:text-green-400';
            case 'offline': return 'text-red-600 dark:text-red-400';
            case 'error': return 'text-yellow-600 dark:text-yellow-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'online':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'offline':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                );
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'online': return 'Backend conectado';
            case 'offline': return 'Backend desconectado';
            case 'error': return 'Error en backend';
            default: return 'Verificando backend...';
        }
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className={getStatusColor()}>
                {getStatusIcon()}
            </div>
            <span className={`text-sm ${getStatusColor()}`}>
                {getStatusText()}
            </span>
            {status === 'error' && errorMessage && (
                <div className="ml-2">
                    <button
                        onClick={() => alert(errorMessage)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Ver detalles del error"
                    >
                        (detalles)
                    </button>
                </div>
            )}
        </div>
    );
};

export default BackendStatus;