
import React from 'react';

interface ChatMessageProps {
    message: {
        text: string;
        isUser: boolean;
    };
}

// Simple parser for basic markdown-like syntax
const parseMessage = (text: string) => {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n/g, '<br/>'); // Line breaks

    // Basic list support
    const lines = html.split('<br/>');
    let inList = false;
    html = lines.map(line => {
        if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
            if (!inList) {
                inList = true;
                return '<ul><li>' + line.trim().substring(1).trim() + '</li>';
            } else {
                return '<li>' + line.trim().substring(1).trim() + '</li>';
            }
        } else {
            if (inList) {
                inList = false;
                return '</ul>' + line;
            }
            return line;
        }
    }).join('<br/>');

    if (inList) {
        html += '</ul>';
    }

    return html.replace(/<br\/>/g, '');
};


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const { text, isUser } = message;

    const bubbleClasses = isUser 
        ? "bg-primary text-white rounded-2xl rounded-br-none"
        : "bg-base-200 dark:bg-base-dark-100 text-text-main dark:text-text-main-dark rounded-2xl rounded-bl-none";

    const wrapperClasses = isUser ? "flex justify-end" : "flex justify-start";

    return (
        <div className={`${wrapperClasses} mb-4 animate-fade-in`}>
            <div className={`py-3 px-4 shadow-md max-w-lg lg:max-w-xl ${bubbleClasses}`}>
                 <div 
                    className="prose prose-sm dark:prose-invert max-w-none prose-p:m-0 prose-ul:m-0 prose-li:m-0"
                    dangerouslySetInnerHTML={{ __html: parseMessage(text) }}
                />
            </div>
        </div>
    );
};

export default ChatMessage;