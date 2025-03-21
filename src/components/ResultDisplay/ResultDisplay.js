import React from 'react';
import './ResultDisplay.css';

function ResultDisplay({ processedImage }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="result-container">
      <div className="image-preview">
        <img src={processedImage} alt="Processed" />
      </div>
      <button onClick={handleDownload} className="download-button">
        Download Image
      </button>
    </div>
  );
}

export default ResultDisplay;
