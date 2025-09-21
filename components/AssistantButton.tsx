

import React from 'react';
import ChatIcon from './icons/ChatIcon';

interface AssistantButtonProps {
    onClick: () => void;
}

const AssistantButton: React.FC<AssistantButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 z-50 bg-teal-500 text-white rounded-full p-5 shadow-2xl shadow-teal-500/40 hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 transition-all duration-300 transform hover:scale-110 animate-pulse"
            aria-label="Abrir assistente de estratégia"
        >
            <ChatIcon className="w-8 h-8" />
        </button>
    );
};

export default AssistantButton;