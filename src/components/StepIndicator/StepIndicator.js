import React from 'react';
import './StepIndicator.css';

function StepIndicator({ currentStep }) {
  const steps = ['Upload', 'Preview', 'Download'];
  
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={step} className={`step ${index + 1 <= currentStep ? 'active' : ''}`}>
          <div className="step-number">{index + 1}</div>
          <div className="step-label">{step}</div>
        </div>
      ))}
    </div>
  );
}

export default StepIndicator;
