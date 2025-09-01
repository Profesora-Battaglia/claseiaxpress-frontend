
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import BackendStatus from '../components/BackendStatus';
import { toolDetails } from '../constants';
import { Tool, ToolCategory, ToolDetail } from '../types';

const WelcomeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-base-100 dark:bg-base-dark-200 rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all animate-fade-in">
            <h2 className="text-2xl font-bold text-text-main dark:text-text-main-dark">¡Bienvenido a ClaseIaXpress!</h2>
            <p className="mt-4 text-text-secondary dark:text-text-secondary-dark">
                Hemos rediseñado tu panel principal para que encuentres tus herramientas pedagógicas más rápido.
                Ahora están agrupadas por categorías para facilitar tu flujo de trabajo.
            </p>
            <ul className="mt-4 space-y-2 text-text-main dark:text-text-main-dark">
                <li><span className="font-semibold text-primary">Planificación:</span> Todos los planificadores en un solo lugar.</li>
                <li><span className="font-semibold text-primary">Evaluación:</span> Crea rúbricas, cuestionarios y da feedback.</li>
                <li><span className="font-semibold text-primary">Recursos para el Aula:</span> Adapta textos, gamifica y más.</li>
            </ul>
            <p className="mt-4 text-text-secondary dark:text-text-secondary-dark">
                ¡Explora las nuevas secciones y potencia tus clases!
            </p>
            <button
                onClick={onClose}
                className="w-full mt-6 py-3 px-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md transition-colors"
            >
                ¡Entendido, a crear!
            </button>
        </div>
    </div>
);

const ToolCategorySection: React.FC<{ title: string; tools: ToolDetail[]; navigate: (path: string) => void; }> = ({ title, tools, navigate }) => (
    <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-main dark:text-text-main-dark border-b-2 border-primary pb-2 mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map(tool => {
                const navLink = navLinks.find(nl => nl.id === tool.id);
                return (
                    <Card 
                        key={tool.id}
                        title={tool.title}
                        description={tool.description || `Accede para comenzar.`}
                        Icon={navLink?.icon}
                        onClick={() => navigate(getLinkPath(tool.id))}
                    />
                )
            })}
        </div>
    </section>
);

// Helper to find a nav link for a tool
import { navLinks } from '../constants';
const getLinkPath = (tool: Tool) => {
    switch (tool) {
        case Tool.DASHBOARD:
            return '/dashboard';
        case Tool.CHATBOT:
            return '/chatbot';
        case Tool.HISTORY:
            return '/history';
        default:
            return `/generator/${tool}`;
    }
};

const Dashboard: React.FC = () => {
    const [showWelcome, setShowWelcome] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenRedesignWelcomeModal');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    const handleCloseWelcome = () => {
        localStorage.setItem('hasSeenRedesignWelcomeModal', 'true');
        setShowWelcome(false);
    }

    const categorizedTools = Object.values(toolDetails).reduce((acc, tool) => {
        if (tool.category && tool.id !== Tool.DASHBOARD && tool.id !== Tool.CHATBOT && tool.id !== Tool.HISTORY) {
            if (!acc[tool.category]) {
                acc[tool.category] = [];
            }
            acc[tool.category].push(tool);
        }
        return acc;
    }, {} as Record<ToolCategory, ToolDetail[]>);

    const categoryOrder: ToolCategory[] = [
        ToolCategory.PLANNING,
        ToolCategory.EVALUATION,
        ToolCategory.CLASSROOM_RESOURCES,
        ToolCategory.COMMUNICATION,
    ];

    return (
        <div className="animate-fade-in">
            {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
            <header className="mb-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-text-main dark:text-text-main-dark">Tu Asistente Pedagógico Inteligente</h1>
                        <p className="mt-2 text-lg text-text-secondary dark:text-text-secondary-dark">¿Qué necesitas crear hoy?</p>
                    </div>
                    <BackendStatus className="mt-2" />
                </div>
            </header>
            
            <main>
                {categoryOrder.map(category => (
                    categorizedTools[category] && (
                        <ToolCategorySection 
                            key={category}
                            title={category}
                            tools={categorizedTools[category]}
                            navigate={navigate}
                        />
                    )
                ))}
            </main>

            <div className="mt-12 p-6 rounded-xl bg-primary text-white shadow-lg">
                <h2 className="text-2xl font-bold">Plan Premium</h2>
                <p className="mt-2 opacity-90">Actualmente estás en el período de prueba de 7 días. ¡Actualiza tu plan para no perder acceso a estas increíbles herramientas!</p>
                <button className="mt-4 bg-white text-primary font-bold py-2 px-6 rounded-lg shadow hover:bg-gray-100 transition-colors">
                    Ver Planes ($6000/mes)
                </button>
            </div>
        </div>
    );
};

export default Dashboard;