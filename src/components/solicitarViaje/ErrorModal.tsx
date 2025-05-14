import React from 'react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-10 mx-4 animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F2B134] text-[#4A4E69] rounded-lg font-medium hover:bg-[#F2B134]/90 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 