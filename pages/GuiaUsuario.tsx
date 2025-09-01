import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const GuiaUsuario: React.FC = () => {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        fetch('/GUIA_DE_USUARIO.md')
            .then(response => response.text())
            .then(text => setMarkdown(text));
    }, []);

    return (
        <div className="bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg p-6 lg:p-10 animate-fade-in">
            <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
        </div>
    );
};

export default GuiaUsuario;