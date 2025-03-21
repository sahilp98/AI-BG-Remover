import React from 'react';
import './PreviewMode.css';

function PreviewMode({ originalImage, mask, onConfirm, onAdjust }) {
  return (
    <div className="preview-container">
      <div className="preview-images">
        <div className="preview-original">
          <h3>Original</h3>
          <img src={originalImage} alt="Original" />
        </div>
        <div className="preview-mask">
          <h3>Detected Objects</h3>
          <img src={mask} alt="Mask" />
        </div>
      </div>
      <div className="preview-controls">
        <button onClick={onAdjust} className="adjust-button">Adjust Mask</button>
        <button onClick={onConfirm} className="confirm-button">Confirm</button>
      </div>
    </div>
  );
}

export default PreviewMode;
