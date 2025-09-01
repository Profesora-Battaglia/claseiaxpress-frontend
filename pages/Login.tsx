
import React from 'react';
import { Logo } from '../constants';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="flex justify-center mb-8">
                    <Logo className="h-12" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-gray-100">Bienvenido de Nuevo</h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-2">Inicia sesión para potenciar tu enseñanza.</p>
                    <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                defaultValue="docente@email.com"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-edu-blue focus:border-edu-blue bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Correo electrónico"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"  className="text-sm font-medium text-gray-700 sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                defaultValue="password"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-edu-blue focus:border-edu-blue bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Contraseña"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-edu-blue focus:ring-edu-blue border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Recordarme
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-edu-blue hover:text-edu-blue-dark">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-edu-blue to-edu-violet hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-edu-violet"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;