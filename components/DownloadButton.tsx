import React from 'react';
import DownloadIcon from './icons/DownloadIcon';
import LoadingSpinner from './LoadingSpinner';

interface DownloadButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, isLoading }) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 font-semibold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300"
        >
            {isLoading ? (
                <>
                    <LoadingSpinner className="h-4 w-4" />
                    <span>Gerando PDF...</span>
                </>
            ) : (
                <>
                    <DownloadIcon className="w-5 h-5" />
                    <span>Download PDF</span>
                </>
            )}
        </button>
    );
};

export default DownloadButton;