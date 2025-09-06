import React, { useState } from 'react';
import './ResultsView.css';

function ResultsView({ processedImage, originalImage, fileName, onTryAgain, onAdjust }) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Create a short delay to show the download animation
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = processedImage;
      
      // Use the original filename if available, otherwise use a default name
      const downloadName = fileName 
        ? `${fileName.split('.')[0]}-no-bg.png` 
        : 'removed-background.png';
      
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
    }, 500);
  };

  return (
    <div className="results-container">
      <h2 className="results-title">Background Removed</h2>
      
      <div className="image-comparison">
        <div className="image-preview-container original">
          <h3>Original</h3>
          <div className="image-wrapper">
            <img src={originalImage} alt="Original" />
          </div>
        </div>
        
        <div className="image-preview-container result">
          <h3>Result</h3>
          <div className="checkered-background">
            <img src={processedImage} alt="Processed" className="processed-image" />
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          onClick={handleDownload} 
          className={`download-button ${isDownloading ? 'downloading' : ''}`}
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download PNG'}
        </button>
        
        <div className="secondary-actions">
          <button onClick={onAdjust} className="adjust-button">
            Adjust Result
          </button>
          
          <button onClick={onTryAgain} className="try-again-button">
            Try Another Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsView;
