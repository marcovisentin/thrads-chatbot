import React, { useState } from 'react';

const Sidebar = ({ settings, onSettingsChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-500 text-white"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 w-64 md:w-48 h-full bg-gradient-to-b from-gray-200 to-gray-300 p-4 text-white transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-40`}>
        <div className="flex justify-center mb-6">
          <img 
            src="/logo_thrads2.png" 
            alt="Company Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
        <div className="flex flex-col justify-center items-center space-y-8 h-[calc(100%-4rem)]">
          {/* Force Toggle */}
          <div className="flex flex-col items-center gap-2 relative group">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.force}
                  onChange={(e) => onSettingsChange('force', e.target.checked)}
                />
                <div className="block bg-blue-300 w-14 h-8 rounded-full"></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${settings.force ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900">Force Ads</span>
            </label>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded p-2 text-center">
              Forces an ad to appear in the next response, regardless of other settings
            </div>
          </div>

          {/* Conversation Offset Slider */}
          <div className="flex flex-col items-center gap-2 w-full relative group">
            <label className="text-sm font-medium text-center text-gray-900">
              Conversation Offset: {settings.conversationOffset}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={settings.conversationOffset}
              onChange={(e) => onSettingsChange('conversationOffset', parseInt(e.target.value))}
              className="w-32 h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded p-2 text-center">
              Minimum number of messages to wait before showing the first ad
            </div>
          </div>

          {/* Ad Frequency Limit Slider */}
          <div className="flex flex-col items-center gap-2 w-full relative group">
            <label className="text-sm font-medium text-center text-gray-900">
              Max Frequency: {settings.adFrequencyLimit}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={settings.adFrequencyLimit}
              onChange={(e) => onSettingsChange('adFrequencyLimit', parseInt(e.target.value))}
              className="w-32 h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded p-2 text-center">
              Minimum number of messages between ads
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;