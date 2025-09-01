
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedContent, Tool } from '../types';
import { navLinks } from '../constants';
import { FiTrash2, FiDownload, FiCopy, FiRefreshCw, FiSearch, FiX, FiClock } from 'react-icons/fi';
import { SafeIcon, validateIcon } from '../utils/iconUtils';
import jsPDF from 'jspdf';

const History: React.FC<{ showToast: (message: string) => void }> = ({ showToast }) => {
    const [history, setHistory] = useState<SavedContent[]>([]);
    const [selectedItem, setSelectedItem] = useState<SavedContent | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Validate icons in development
    useEffect(() => {
        validateIcon('FiClock', FiClock);
        validateIcon('FiTrash2', FiTrash2);
        validateIcon('FiDownload', FiDownload);
        validateIcon('FiCopy', FiCopy);
        validateIcon('FiRefreshCw', FiRefreshCw);
        validateIcon('FiSearch', FiSearch);
        validateIcon('FiX', FiX);
    }, []);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('claseIaXpressHistory') || '[]');
        setHistory(storedHistory);
        if (storedHistory.length > 0) {
            setSelectedItem(storedHistory[0]);
        }
    }, []);

    const filteredHistory = useMemo(() => {
        if (!searchTerm) return history;
        return history.filter(item => {
            const contentText = item.content.replace(/<[^>]*>/g, '').toLowerCase();
            const titleText = item.toolTitle.toLowerCase();
            const query = searchTerm.toLowerCase();
            return contentText.includes(query) || titleText.includes(query);
        });
    }, [searchTerm, history]);

    const getToolIcon = (toolId: Tool) => {
        const navLink = navLinks.find(link => link.id === toolId);
        if (!navLink) return null;
        return <SafeIcon IconComponent={navLink.icon} className="w-5 h-5 mr-3 text-primary flex-shrink-0" />;
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent item selection when deleting
        if (window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
            const updatedHistory = history.filter(item => item.id !== id);
            setHistory(updatedHistory);
            localStorage.setItem('claseIaXpressHistory', JSON.stringify(updatedHistory));
            showToast('Elemento eliminado del historial.');

            if (selectedItem?.id === id) {
                const newSelectedItem = filteredHistory.find(item => item.id !== id) || null;
                setSelectedItem(newSelectedItem);
            }
        }
    };

    const handleClearAll = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar TODO el historial? Esta acción no se puede deshacer.')) {
            setHistory([]);
            setSelectedItem(null);
            localStorage.removeItem('claseIaXpressHistory');
            showToast('Historial borrado por completo.');
        }
    };

    const handleReuse = () => {
        if (!selectedItem) return;
        navigate(`/generator/${selectedItem.toolId}`, { state: { formData: selectedItem.formData } });
    };

    const handleCopy = () => {
        if (selectedItem?.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = selectedItem.content;
            navigator.clipboard.writeText(tempDiv.innerText);
            showToast('Contenido copiado al portapapeles.');
        }
    };

    const handleDownloadPDF = () => {
        if (!selectedItem?.content) return;
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = selectedItem.content;

        const isLandscape = selectedItem.toolId === Tool.ANNUAL_PLANNER || selectedItem.toolId === Tool.QUARTERLY_PLANNER;
        const pdf = new jsPDF({ orientation: isLandscape ? 'l' : 'p', unit: 'mm', format: 'a4' });
        
        const margin = 15;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const contentWidth = pdfWidth - (margin * 2);

        pdf.html(contentDiv, {
            callback: (doc) => {
                doc.save(`${selectedItem.toolId}_${new Date(selectedItem.timestamp).toLocaleDateString()}.pdf`);
            },
            margin: [margin, margin, margin, margin],
            autoPaging: 'text',
            width: contentWidth,
            windowWidth: contentDiv.scrollWidth,
            html2canvas: { scale: 2, useCORS: true, logging: false }
        });
    };

    return (
        <div className="flex flex-col h-full bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg animate-fade-in">
            <header className="p-4 border-b border-base-200 dark:border-base-dark-100 flex-shrink-0">
                <h1 className="text-xl font-bold text-text-main dark:text-text-main-dark">Historial de Contenido</h1>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Busca, revisa y reutiliza tus creaciones guardadas.</p>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-1/3 border-r border-base-200 dark:border-base-dark-100 flex flex-col">
                    <div className="p-4 border-b border-base-200 dark:border-base-dark-100">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Buscar en el historial..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            {searchTerm && <FiX onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white" />}
                        </div>
                    </div>
                    <ul className="overflow-y-auto flex-grow">
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map(item => (
                                <li key={item.id} onClick={() => setSelectedItem(item)} className={`p-4 border-b border-base-200 dark:border-base-dark-100 cursor-pointer hover:bg-base-200 dark:hover:bg-base-dark-100/50 transition-colors ${
                                    selectedItem?.id === item.id ? 'bg-primary/10 dark:bg-primary/20' : ''
                                }`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start">
                                            {getToolIcon(item.toolId)}
                                            <div>
                                                <h3 className="font-semibold text-text-main dark:text-text-main-dark line-clamp-1">{item.toolTitle}</h3>
                                                <p className="text-xs text-text-secondary/70 dark:text-text-secondary-dark/70">{new Date(item.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button onClick={(e) => handleDelete(item.id, e)} title="Eliminar" className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full flex-shrink-0"><FiTrash2 /></button>
                                    </div>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-2 line-clamp-2">{item.content.replace(/<[^>]*>/g, '')}</p>
                                </li>
                            ))
                        ) : (
                            <div className="p-6 text-center text-text-secondary dark:text-text-secondary-dark">
                                <p className="font-semibold">No se encontraron resultados.</p>
                                <p className="mt-2 text-sm">Prueba con otra búsqueda o vacía el campo.</p>
                            </div>
                        )}
                    </ul>
                    {history.length > 0 && (
                        <div className="p-2 border-t border-base-200 dark:border-base-dark-100">
                             <button 
                                onClick={handleClearAll}
                                className="w-full px-4 py-2 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <FiTrash2 />
                                Borrar Todo el Historial
                            </button>
                        </div>
                    )}
                </aside>
                <main className="w-2/3 overflow-y-auto p-6">
                    {selectedItem ? (
                        <div>
                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-base-200 dark:border-base-dark-100">
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main dark:text-text-main-dark">{selectedItem.toolTitle}</h2>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Generado el: {new Date(selectedItem.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleReuse} title="Reutilizar" className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"><FiRefreshCw /></button>
                                    <button onClick={handleCopy} title="Copiar Texto" className="p-2 rounded-full hover:bg-base-200 dark:hover:bg-base-dark-100 transition-colors"><FiCopy /></button>
                                    <button onClick={handleDownloadPDF} title="Descargar PDF" className="p-2 rounded-full hover:bg-base-200 dark:hover:bg-base-dark-100 transition-colors"><FiDownload /></button>
                                </div>
                            </div>
                            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedItem.content }} />
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-text-secondary dark:text-text-secondary-dark">
                            <SafeIcon IconComponent={FiClock} size={48} className="mb-4" />
                            <p className="font-semibold text-lg">Tu historial está vacío o no has seleccionado nada.</p>
                            <p className="mt-2 text-center">Usa las herramientas para generar contenido y guárdalo para acceder a él desde aquí.</p>
                         </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default History;