import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Tool, ToolDetail, FormField, SavedContent } from '../types';
import { generateContent } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { modalidadesSecundaria, modalidadesTecnica } from '../constants';
import jsPDF from 'jspdf';

interface GenericGeneratorProps {
    tool: ToolDetail;
    showToast: (message: string) => void;
}

const sanitizeHtmlContent = (html: string): string => {
    if (typeof window === 'undefined') {
        return html;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove Google Fonts links
    const fontLinks = doc.querySelectorAll('link[href*="fonts.googleapis.com"]');
    fontLinks.forEach(link => link.remove());

    // Remove style tags that might import fonts
    const styleTags = doc.querySelectorAll('style');
    styleTags.forEach(style => {
        if (style.textContent && style.textContent.includes('@import url(')) {
            style.textContent = style.textContent.replace(/@import url\\(.*?\\);/g, '');
        }
    });

    return doc.body.innerHTML;
};

const GenericGenerator: React.FC<GenericGeneratorProps> = ({ tool, showToast }) => {
    const location = useLocation();
        const initialFormState = useMemo(() => {
        return tool.formFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {});
    }, [tool.formFields]);
    
    const [formData, setFormData] = useState<Record<string, string>>(initialFormState);
    const [generatedContent, setGeneratedContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingActivities, setIsGeneratingActivities] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [modalidadOptions, setModalidadOptions] = useState<string[]>([]);
    const [teacherName, setTeacherName] = useState<string>(() => localStorage.getItem('teacherName') || 'Docente Pro');
    const [schoolName, setSchoolName] = useState<string>(() => localStorage.getItem('schoolName') || 'Colegio Exemplar');
    const contentEditableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (location.state?.formData) {
            setFormData(location.state.formData);
            showToast(`Plantilla cargada. ¡Listo para editar y generar!`);
            // Clear the state to prevent re-loading on refresh
            window.history.replaceState({}, document.title)
        }
    }, [location.state, showToast]);
    
    useEffect(() => {
        localStorage.setItem('teacherName', teacherName);
    }, [teacherName]);

    useEffect(() => {
        localStorage.setItem('schoolName', schoolName);
    }, [schoolName]);

    useEffect(() => {
        // Reset form when tool changes, but not if there's state from navigation
        if (!location.state?.formData) {
            setFormData(initialFormState);
        }
        setGeneratedContent('');
        setError('');
        setModalidadOptions([]);
        setIsGeneratingActivities(false);
    }, [tool, initialFormState, location.state]);

    useEffect(() => {
        if ([Tool.PLANNER, Tool.ANNUAL_PLANNER, Tool.QUARTERLY_PLANNER].includes(tool.id)) {
            const nivel = formData.nivel;
            if (nivel === 'Secundaria Orientada') {
                setModalidadOptions(modalidadesSecundaria);
            } else if (nivel === 'Secundaria Técnica') {
                setModalidadOptions(modalidadesTecnica);
            } else {
                setModalidadOptions([]);
            }
            if (nivel !== 'Secundaria Orientada' && nivel !== 'Secundaria Técnica') {
                 setFormData(prev => ({ ...prev, modalidad: '' }));
            }
        }
    }, [formData.nivel, tool.id]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const hasMissingFields = tool.formFields.some(field => {
            if (field.id === 'modalidad') {
                return modalidadOptions.length > 0 && !formData.modalidad;
            }
            // Special check for the text adapter tool
            if (tool.id === Tool.TEXT_SIMPLIFIER && field.id === 'detallesNEE') {
                return formData.accion === 'Sugerir Adaptaciones para NEE' && !formData.detallesNEE;
            }
            return field.required && !formData[field.id]
        });

        if (hasMissingFields) {
            setError('Por favor, completa todos los campos requeridos.');
            return;
        }

        setIsLoading(true);
        setGeneratedContent('');

        let promptDetails = '';
        if (tool.id === Tool.TEXT_SIMPLIFIER) {
            const { textoOriginal, accion, nivelDestino, detallesNEE } = formData;
            let actionInstruction = '';
            switch (accion) {
                case 'Simplificar':
                    actionInstruction = `Simplifica el siguiente texto para que sea fácilmente comprensible por un estudiante de ${nivelDestino}. Usa vocabulario sencillo, oraciones cortas y, si es necesario, analogías simples.`;
                    break;
                case 'Complejizar':
                    actionInstruction = `Toma el siguiente texto y adáptalo para un nivel avanzado (${nivelDestino}). Enriquece el vocabulario, utiliza estructuras de oraciones más complejas y profundiza en los conceptos clave sin perder la esencia del original.`;
                    break;
                case 'Sugerir Adaptaciones para NEE':
                    actionInstruction = `Actúa como un psicopedagogo experto. Basado en el siguiente texto y las características del estudiante, genera una propuesta de adaptación curricular. Describe las características del estudiante: ${detallesNEE}. La propuesta debe incluir: 1) Estrategias de acceso al texto. 2) Adaptación de los materiales o del formato. 3) Al menos 2 actividades inclusivas basadas en el texto.`;
                    break;
            }
            promptDetails = `${actionInstruction}\n\n--- TEXTO ORIGINAL ---\n${textoOriginal}`;
        } else {
            promptDetails = tool.formFields
                .map(field => {
                    const value = formData[field.id];
                    if (!value) return '';
                    return `- ${field.label}: ${value}`;
                })
                .filter(Boolean)
                .join('\n');
        }

        const fullPrompt = `${tool.promptInstruction}\n\n${promptDetails}\n\nGenera el resultado en formato HTML, bien estructurado y listo para usar. Utiliza etiquetas como <h1>, <h2>, <ul>, <li>, <p>, <strong>, <table>, <th>, <tr>, <td> etc. para dar formato al texto. No incluyas 

al principio ni 

al final, solo el cuerpo del HTML.`;
        
        try {
            const response = await generateContent(fullPrompt);
            const sanitizedResponse = sanitizeHtmlContent(response);
            setGeneratedContent(sanitizedResponse);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateActivities = async () => {
        setIsGeneratingActivities(true);

        const planContext = Object.entries(formData)
            .map(([key, value]) => {
                const field = tool.formFields.find(f => f.id === key);
                return value && field ? `- ${field.label}: ${value}` : null;
            })
            .filter(Boolean)
            .join('\n');

        const activityPrompt = `Basado en la siguiente planificación de clase:\n${planContext}\n\nGenera 3 actividades creativas y prácticas para los estudiantes (una de inicio, una de desarrollo y una de cierre). Detalla cada actividad con su objetivo, materiales (si son necesarios) y pasos a seguir. Formatea la respuesta como un fragmento de HTML bien estructurado, usando etiquetas como <h3> para el título de cada actividad, <p> para descripciones y <ul>/<li> para los pasos o materiales.`;

        try {
            const response = await generateContent(activityPrompt);
            const sanitizedResponse = sanitizeHtmlContent(response);
            const activitiesHtml = `
                <hr class="my-6 dark:border-gray-600">
                <h2 class="text-xl font-bold mb-4">Actividades Sugeridas</h2>
                ${sanitizedResponse}
            `;
            setGeneratedContent(prev => prev + activitiesHtml);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsGeneratingActivities(false);
        }
    }
    
    const handleDownloadPDF = async () => {
        const contentElement = contentEditableRef.current;
        if (!contentElement) {
            console.error("Content element not found for PDF generation.");
            return;
        }
    
        const isLandscape = tool.id === Tool.ANNUAL_PLANNER || tool.id === Tool.QUARTERLY_PLANNER;
        const pdf = new jsPDF({ 
            orientation: isLandscape ? 'l' : 'p', 
            unit: 'mm', 
            format: 'a4' 
        });
    
        const topMargin = 35;
        const bottomMargin = 20;
        const margin = 15;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const contentWidth = pdfWidth - (margin * 2);
    
        const addHeaderAndFooter = (doc: jsPDF) => {
            const pageCount = (doc.internal as any).getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
    
                // Header
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.text(schoolName, margin, margin + 5);
                
                // Add app name to the top right
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150); // Grey color
                doc.text('ClaseIaXpress', pdfWidth - margin, margin + 5, { align: 'right' });
                doc.setTextColor(0, 0, 0); // Reset color
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text(`Docente: ${teacherName}`, margin, margin + 12);
                
                const mainTitle = formData.materia || formData.tema || tool.title;
                doc.text(`Documento: ${mainTitle}`, margin, margin + 19);
                
                doc.setDrawColor(200, 200, 200);
                doc.line(margin, margin + 25, pdfWidth - margin, margin + 25);
    
                // Footer
                const footerText = `Página ${i} de ${pageCount}`;
                doc.setFontSize(9);
                doc.text(footerText, pdfWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
            }
        };
    
        const contentHTML = contentElement.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.className = 'prose max-w-none dark:prose-invert';
        tempDiv.style.width = `${contentWidth}mm`;
        tempDiv.innerHTML = contentHTML;
        document.body.appendChild(tempDiv);
    
        pdf.html(tempDiv, {
            callback: function (doc) {
                document.body.removeChild(tempDiv);
                addHeaderAndFooter(doc);
                doc.save(`${tool.id}_${formData.tema || 'documento'}.pdf`);
            },
            margin: [topMargin, margin, bottomMargin, margin],
            autoPaging: 'text',
            width: contentWidth,
            windowWidth: tempDiv.scrollWidth,
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false
            }
        });
    };

    const renderField = (field: FormField) => {
        if (field.id === 'modalidad' && modalidadOptions.length === 0) return null;

        // Conditionally render detailsNEE field for the text adapter tool
        if (tool.id === Tool.TEXT_SIMPLIFIER && field.id === 'detallesNEE') {
            if (formData.accion !== 'Sugerir Adaptaciones para NEE') {
                return null;
            }
        }

        const options = field.id === 'modalidad' ? modalidadOptions : field.options;
        let isRequired = field.required;
        if (field.id === 'modalidad') {
            isRequired = modalidadOptions.length > 0;
        } else if (tool.id === Tool.TEXT_SIMPLIFIER && field.id === 'detallesNEE') {
            isRequired = formData.accion === 'Sugerir Adaptaciones para NEE';
        }

        const fieldWrapperClass = (field.id === 'modalidad' || (tool.id === Tool.TEXT_SIMPLIFIER && field.id === 'detallesNEE')) 
            ? "mb-4 animate-fade-in" 
            : "mb-4";

        return (
             <div key={field.id} className={fieldWrapperClass}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}{isRequired && <span className="text-red-500">*</span>}</label>
                {field.type === 'textarea' ? (
                    <textarea name={field.id} id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} placeholder={field.placeholder} required={isRequired} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 focus:ring-2 focus:ring-edu-blue focus:outline-none bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" rows={4}></textarea>
                ) : field.type === 'select' ? (
                     <select name={field.id} id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} required={isRequired} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 focus:ring-2 focus:ring-edu-blue focus:outline-none bg-white dark:bg-gray-700 dark:text-white">
                        <option value="" disabled>{field.placeholder}</option>
                        {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                ) : (
                    <input type="text" name={field.id} id={field.id} value={formData[field.id] || ''} onChange={handleInputChange} placeholder={field.placeholder} required={isRequired} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 focus:ring-2 focus:ring-edu-blue focus:outline-none bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
                )}
            </div>
        )
    };
    
    const handleCopy = () => {
        if(contentEditableRef.current) {
            navigator.clipboard.writeText(contentEditableRef.current.innerText);
            showToast('¡Texto copiado al portapapeles!');
        }
    }

    const handleSaveToHistory = () => {
        if (!generatedContent || !contentEditableRef.current) return; 
        
        const currentContent = contentEditableRef.current.innerHTML;

        const newEntry: SavedContent = {
            id: new Date().toISOString(),
            toolId: tool.id,
            toolTitle: tool.title,
            content: currentContent,
            formData: formData,
            timestamp: Date.now()
        };

        const history = JSON.parse(localStorage.getItem('claseIaXpressHistory') || '[]');
        const updatedHistory = [newEntry, ...history].slice(0, 20); // Keep latest 20
        localStorage.setItem('claseIaXpressHistory', JSON.stringify(updatedHistory));
        showToast('¡Contenido guardado en el historial!');
    };

    const handleClear = () => {
        setGeneratedContent('');
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="bg-base-200 dark:bg-base-dark-200 rounded-xl shadow-lg p-6 flex flex-col">
                <header>
                    <h1 className="text-2xl font-bold text-text-main dark:text-text-main-dark">{tool.title}</h1>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">{tool.description}</p>
                </header>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 flex-grow flex flex-col">
                    <div className="flex-grow">
                        {tool.formFields.map(field => renderField(field))}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading || isGeneratingActivities} className="w-full py-3 px-4 bg-gradient-to-r from-edu-blue to-edu-violet text-white font-bold rounded-lg shadow-md hover:opacity-90 disabled:opacity-50 transition-opacity">
                        {isLoading ? 'Generando...' : 'Generar Contenido'}
                    </button>
                </form>
            </div>

            <div className="bg-base-200 dark:bg-base-dark-200 rounded-xl shadow-lg p-6 flex flex-col h-full max-h-[85vh]">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-main dark:text-text-main-dark">Resultado Generado</h2>
                    {generatedContent && !isLoading && (
                        <div className="flex items-center gap-2">
                            <button onClick={handleSaveToHistory} aria-label="Guardar en Historial" title="Guardar en Historial" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                             </button>
                             <button onClick={handleDownloadPDF} aria-label="Descargar PDF" title="Descargar PDF" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                             </button>
                             <button onClick={handleCopy} aria-label="Copiar texto" title="Copiar texto" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </button>
                             <button onClick={handleClear} aria-label="Limpiar resultado" title="Limpiar resultado" className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    )}
                </div>
                {generatedContent && !isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 animate-fade-in">
                        <div>
                            <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Docente</label>
                            <input type="text" id="teacherName" value={teacherName} onChange={e => setTeacherName(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 focus:ring-2 focus:ring-edu-blue focus:outline-none bg-white dark:bg-gray-700 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escuela / Colegio</label>
                            <input type="text" id="schoolName" value={schoolName} onChange={e => setSchoolName(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md mt-1 focus:ring-2 focus:ring-edu-blue focus:outline-none bg-white dark:bg-gray-700 dark:text-white" />
                        </div>
                    </div>
                )}
                <div className="flex-grow overflow-y-auto p-1 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
                    {isLoading && <LoadingSpinner />}
                    {generatedContent ? (
                        <div>
                             <p className="text-xs text-gray-600 dark:text-yellow-200 mb-2 p-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800/50 rounded-md">
                                ✏️ ¡Puedes hacer clic en el texto a continuación para editarlo antes de descargarlo!
                            </p>
                            <div
                                ref={contentEditableRef}
                                contentEditable={!isLoading}
                                suppressContentEditableWarning={true}
                                className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-edu-blue"
                                dangerouslySetInnerHTML={{ __html: generatedContent }}
                            >
                            </div>
                             {tool.id === Tool.PLANNER && !isLoading && (
                                <div className="mt-6 text-center">
                                    {isGeneratingActivities ? (
                                        <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                                            <LoadingSpinner />
                                            <span className="ml-2">Sugiriendo actividades...</span>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={handleGenerateActivities}
                                            className="px-5 py-2.5 bg-edu-blue-light text-edu-blue-dark font-semibold rounded-lg shadow-sm hover:bg-edu-blue-dark hover:text-white transition-all duration-300"
                                        >
                                            Sugerir Actividades con IA
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        !isLoading && <p className="text-gray-500 dark:text-gray-400 text-center pt-4">El contenido generado aparecerá aquí...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenericGenerator;