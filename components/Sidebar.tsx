
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks, Logo } from '../constants';
import { SafeIcon } from '../utils/iconUtils';
import { Tool } from '../types';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';

interface SidebarProps {
    onLogout: () => void;
    theme: string;
    toggleTheme: () => void;
}




const Sidebar: React.FC<SidebarProps> = ({ onLogout, theme, toggleTheme }) => {
    const location = useLocation();

    const getLinkPath = (tool: Tool) => {
        switch (tool) {
            case Tool.DASHBOARD:
                return '/dashboard';
            case Tool.CHATBOT:
                return '/chatbot';
            case Tool.HISTORY:
                return '/history';
            case Tool.USER_GUIDE:
                return '/guia-de-usuario';
            default:
                return `/generator/${tool}`;
        }
    };

    const isActive = (tool: Tool) => {
        const path = getLinkPath(tool);
        if (tool === Tool.DASHBOARD && location.pathname === '/') return true;
        if (path.includes(':tool')) {
            const currentTool = location.pathname.split('/').pop();
            return currentTool === tool;
        }
        return location.pathname === path;
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-primary flex flex-col">
            <div className="h-20 flex items-center px-6 border-b border-primary-dark">
                <Logo className="h-8" />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                    <Link
                        key={link.id}
                        to={getLinkPath(link.id)}
                        className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium ${
                            isActive(link.id)
                                ? 'bg-primary-dark text-white shadow-lg'
                                : 'text-blue-100 hover:bg-primary-dark hover:text-white'
                        }`}
                    >
                        <SafeIcon IconComponent={link.icon} className="w-5 h-5 mr-3" />
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="px-4 py-6 border-t border-primary-dark">
                 <div className="flex justify-center mb-4">
                    <button onClick={toggleTheme} className="flex items-center gap-2 p-2 rounded-full text-blue-200 hover:bg-primary-dark transition-colors">
                        {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
                    </button>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary-dark/50">
                    <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/100" alt="User" />
                    <div>
                        <p className="text-sm font-semibold text-white">Docente Pro</p>
                        <p className="text-xs text-blue-200">docente@email.com</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full mt-4 flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg text-blue-200 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
                >
                    <FiLogOut className="w-5 h-5 mr-3" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;