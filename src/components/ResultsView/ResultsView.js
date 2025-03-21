import React from 'react';
import './ResultsView.css';

function ResultsView({ processedImage, originalImage, onTryAgain }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'removed-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="results-container">
      <div className="image-comparison">
        <div className="image-preview-container original">
          <h3>Original</h3>
          <img src={originalImage} alt="Original" />
        </div>
        <div className="image-preview-container">
          <h3>Result</h3>
          <div className="checkered-background">
            <img src={processedImage} alt="Processed" className="processed-image" />
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button onClick={handleDownload} className="download-button">
          Download PNG
        </button>
        <button onClick={onTryAgain} className="try-again-button">
          Try Another Image
        </button>
      </div>
    </div>
  );
}

export default ResultsView;
