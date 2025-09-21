import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import XIcon from './icons/XIcon';
import SendIcon from './icons/SendIcon';
import LoadingSpinner from './LoadingSpinner';
import SparklesIcon from './icons/SparklesIcon';

interface AssistantModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isAssistant = message.role === 'assistant';
    if (message.role === 'system') return null; // Não exibe a mensagem de sistema

    return (
        <div className={`flex items-start gap-3 ${isAssistant ? '' : 'justify-end'}`}>
            <div className={`max-w-lg p-3 rounded-xl ${isAssistant ? 'bg-slate-700 text-slate-200' : 'bg-teal-500 text-white'}`}>
                <p className="whitespace-pre-wrap text-sm">{message.text}</p>
            </div>
        </div>
    );
};


const AssistantModal: React.FC<AssistantModalProps> = ({ isOpen, onClose, history, onSendMessage, isLoading }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [history]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentMessage.trim() && !isLoading) {
            onSendMessage(currentMessage);
            setCurrentMessage('');
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-2xl h-[80vh] bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-teal-400/10 text-teal-300 flex items-center justify-center">
                            <SparklesIcon className="w-5 h-5"/>
                         </div>
                         <div>
                            <h2 className="text-lg font-bold text-white">Assistente de Estratégia</h2>
                            <p className="text-xs text-slate-400">Seu tutor de marketing pessoal</p>
                         </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                        <XIcon className="w-5 h-5" />
                        <span className="sr-only">Fechar</span>
                    </button>
                </header>

                {/* Chat Body */}
                <div ref={chatBodyRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                   {history.map((msg, index) => (
                       <ChatBubble key={index} message={msg} />
                   ))}
                   {isLoading && (
                       <div className="flex items-start gap-3">
                           <div className="max-w-lg p-3 rounded-xl bg-slate-700">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <LoadingSpinner className="w-4 h-4" />
                                    <span>Pensando...</span>
                                </div>
                           </div>
                       </div>
                   )}
                </div>

                {/* Input Form */}
                <div className="p-4 border-t border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <textarea
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Pergunte sobre as estratégias, públicos, etc..."
                            rows={1}
                            disabled={isLoading}
                            className="flex-1 p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition duration-200 resize-none"
                        />
                        <button 
                            type="submit"
                            disabled={isLoading || !currentMessage.trim()}
                            className="p-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                        >
                           <SendIcon className="w-5 h-5" />
                           <span className="sr-only">Enviar</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssistantModal;