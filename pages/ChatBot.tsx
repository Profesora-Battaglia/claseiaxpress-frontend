import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { Chat, createChat } from '../services/geminiService';
import { FiSend } from 'react-icons/fi';

interface Message {
    text: string;
    isUser: boolean;
}

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: '¡Hola! Soy tu asistente pedagógico. Puedo ayudarte con el currículo de la DGE Mendoza, generar ideas, o explicarte conceptos pedagógicos. ¿Cómo empezamos?', isUser: false }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            try {
                const chatSession = createChat();
                setChat(chatSession);
            } catch (error) {
                console.error("Failed to initialize chat:", error);
                setMessages(prev => [...prev, { text: "Error al iniciar el chat. Por favor, verifica la configuración.", isUser: false }]);
            }
        };
        initChat();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async (messageText: string) => {
        if (messageText.trim() === '' || isLoading || !chat) return;

        const userMessage: Message = { text: messageText, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage(messageText);
            const botMessage: Message = { text: response, isUser: false };
            setMessages(prev => [...prev, botMessage]);
        } catch (error: any) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { text: error.message, isUser: false };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = () => {
        sendMessage(input);
    };

    const handleSuggestionClick = (suggestion: string) => {
        sendMessage(suggestion);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const suggestions = [
        "Dame ideas para una clase de historia de 2do año.",
        "¿Cuáles son los ejes del diseño curricular de primaria en matemática?",
        "Genera una actividad rompehielo para secundaria."
    ]

    return (
        <div className="flex flex-col h-full bg-base-100 dark:bg-base-dark-200 rounded-xl shadow-lg">
            <header className="p-4 border-b border-base-200 dark:border-base-dark-100">
                <h1 className="text-xl font-bold text-text-main dark:text-text-main-dark">ChatBot Pedagógico</h1>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Tu asistente para consultas curriculares y pedagógicas</p>
            </header>
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && <div className="flex justify-start"><LoadingSpinner /></div>}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-4 border-t border-base-200 dark:border-base-dark-100 bg-base-100/50 dark:bg-base-dark-100/50 rounded-b-xl">
                 {messages.length <= 2 && !isLoading && (
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <p className='text-sm text-text-secondary dark:text-text-secondary-dark mr-2'>Sugerencias:</p>
                        {suggestions.map((s, i) => (
                            <button key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-1.5 bg-base-200 dark:bg-base-dark-100 text-sm text-text-secondary dark:text-text-secondary-dark rounded-full hover:bg-base-300 dark:hover:bg-base-dark-200 transition-colors">
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu consulta aquí..."
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-base-100 dark:bg-base-dark-100 text-text-main dark:text-text-main-dark placeholder-text-secondary dark:placeholder-text-secondary-dark"
                        disabled={isLoading || !chat}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !chat}
                        className="p-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                       <FiSend className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;