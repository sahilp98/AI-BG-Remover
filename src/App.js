import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader/ImageUploader';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ResultDisplay from './components/ResultDisplay/ResultDisplay';
import PreviewMode from './components/PreviewMode/PreviewMode';
import { processImage, finalizeImage } from './services/imageService';
import Header from './components/Header/Header';
import StepIndicator from './components/StepIndicator/StepIndicator';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [quality, setQuality] = useState(80);
  const [previewData, setPreviewData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleImageSelect = async (file) => {
    setCurrentStep(2);
    setIsProcessing(true);
    setError(null);
    setProcessedImage(null);
    setPreviewData(null);
    
    try {
      const { mask } = await processImage(file, quality);
      setPreviewData({ original: URL.createObjectURL(file), mask });
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    setCurrentStep(3);
    if (!previewData) return;
    
    setIsProcessing(true);
    try {
      const result = await finalizeImage(previewData.original, previewData.mask, quality);
      setProcessedImage(result);
      setPreviewData(null);
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <main>
        <StepIndicator currentStep={currentStep} />
        <ImageUploader onImageSelect={handleImageSelect} />
        {previewData && (
          <PreviewMode
            originalImage={previewData.original}
            mask={previewData.mask}
            onConfirm={handleConfirm}
            onAdjust={() => setQuality(prev => Math.max(prev - 10, 0))}
          />
        )}
        {isProcessing && <LoadingSpinner />}
        {error && <p className="error-message">{error}</p>}
        {processedImage && <ResultDisplay processedImage={processedImage} />}
      </main>
    </div>
  );
}

export default App;
