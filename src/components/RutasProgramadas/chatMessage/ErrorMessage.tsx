import React from 'react';

interface ErrorMessageProps {
    error: string;
    onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClose }) => {
    return (
        <div className="bg-red-50 p-3 rounded-lg text-red-700 text-sm border border-red-200 shadow-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
                <p>{error}</p>
                <button 
                    className="text-red-800 hover:text-red-900 underline text-xs mt-1"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ErrorMessage; 