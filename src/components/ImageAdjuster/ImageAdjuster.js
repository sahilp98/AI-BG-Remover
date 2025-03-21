import React from 'react';
import './ImageAdjuster.css';

function ImageAdjuster({ quality, onQualityChange, onApply }) {
  return (
    <div className="image-adjuster">
      <div className="adjuster-control">
        <label>Detection Sensitivity</label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={quality} 
          onChange={(e) => onQualityChange(Number(e.target.value))}
        />
        <span>{quality}%</span>
      </div>
      <button className="apply-button" onClick={onApply}>
        Apply Changes
      </button>
    </div>
  );
}

export default ImageAdjuster;
