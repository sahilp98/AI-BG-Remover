import React, { useState } from 'react';
import './App.css';
import ModernHeader from './components/ModernHeader/ModernHeader';
import UploadArea from './components/UploadArea/UploadArea';
import ModernSpinner from './components/ModernSpinner/ModernSpinner';
import ResultsView from './components/ResultsView/ResultsView';
import ImageAdjuster from './components/ImageAdjuster/ImageAdjuster';
import { processImage, finalizeImage } from './services/imageService';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [quality, setQuality] = useState(80);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const handleImageSelect = async (file) => {
    setCurrentFile(file);
    setIsProcessing(true);
    setError(null);
    await processImageWithQuality(file);
  };

  const processImageWithQuality = async (file) => {
    try {
      setIsProcessing(true);
      setOriginalImage(URL.createObjectURL(file));
      const { mask } = await processImage(file, quality);
      const result = await finalizeImage(URL.createObjectURL(file), mask);
      setProcessedImage(result);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdjustmentApply = async () => {
    if (currentFile) {
      await processImageWithQuality(currentFile);
      setIsAdjusting(false);
    }
  };

  return (
    <div className="App">
      <ModernHeader />
      <main>
        {!isProcessing && !processedImage && (
          <UploadArea onImageSelect={handleImageSelect} />
        )}
        {isProcessing && <ModernSpinner />}
        {error && <div className="error-message">{error}</div>}
        {processedImage && !isAdjusting && (
          <ResultsView 
            processedImage={processedImage}
            originalImage={originalImage}
            onAdjust={() => setIsAdjusting(true)}
            onTryAgain={() => {
              setProcessedImage(null);
              setOriginalImage(null);
              setCurrentFile(null);
            }}
          />
        )}
        {isAdjusting && (
          <div className="adjustment-container">
            <ImageAdjuster
              quality={quality}
              onQualityChange={setQuality}
              onApply={handleAdjustmentApply}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
