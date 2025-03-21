import React from 'react';
import './ImageControls.css';

function ImageControls({ onQualityChange, quality }) {
  return (
    <div className="image-controls">
      <div className="control-group">
        <label>Quality:</label>
        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={(e) => onQualityChange(Number(e.target.value))}
        />
        <span>{quality}%</span>
      </div>
    </div>
  );
}

export default ImageControls;
