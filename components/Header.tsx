
import React from 'react';


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Momentum AI</h1>
                <p className="text-xs text-gray-400">Video Generator</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-4">
              <a href="#" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
                Features
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
                Pricing
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-cyan-400 transition-colors">
                Support
              </a>
            </nav>
            <div className="h-6 w-px bg-gray-600"></div>
            <button className="text-sm bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors">
              Get Started
            </button>
          </div>
          
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
