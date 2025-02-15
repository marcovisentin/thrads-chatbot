import React from 'react';

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Welcome to the Thrads Demo!</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-600">
        <p className="mb-4">
            This is a <strong>mock chatbot </strong> developed to demonstrate how our ad-server works.  
            In this demo we:
            <ul className="list-disc list-inside mb-4">
              <li>Removed some of our internal filters to provide more examples to the demo user</li>
              <li>Show what we believe is a great way to integrate in chatbots</li>
            </ul>
          </p>
          <p className="mb-4">
            We hope you enjoy the demo!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;