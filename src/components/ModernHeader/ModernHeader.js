import React from 'react';
import './ModernHeader.css';

function ModernHeader() {
  return (
    <header className="modern-header">
      <div className="header-content">
        <div className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <h1>AI Background Remover</h1>
        </div>
        <p>Remove image backgrounds automatically in seconds with AI</p>
      </div>
    </header>
  );
}

export default ModernHeader;
