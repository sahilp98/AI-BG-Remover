import React, { useState } from 'react';
import './App.css';
import ModernHeader from './components/ModernHeader/ModernHeader';
import UploadArea from './components/UploadArea/UploadArea';
import ModernSpinner from './components/ModernSpinner/ModernSpinner';
import ResultsView from './components/ResultsView/ResultsView';
import ImageAdjuster from './components/ImageAdjuster/ImageAdjuster';
import { processImage, finalizeImage } from './services/imageService';

function App() {
  // Application state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [quality, setQuality] = useState(80);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [fileName, setFileName] = useState('');

  /**
   * Handle image selection from the upload area
   * @param {File} file - The selected image file
   */
  const handleImageSelect = async (file) => {
    // Reset state and start processing
    setCurrentFile(file);
    setFileName(file.name);
    setIsProcessing(true);
    setError(null);
    setProcessedImage(null);
    
    try {
      // Process the image with the current quality setting
      await processImageWithQuality(file);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Error during image selection:', err);
    }
  };

  /**
   * Process the image with the current quality setting
   * @param {File} file - The image file to process
   */
  const processImageWithQuality = async (file) => {
    try {
      setIsProcessing(true);
      
      // Step 1: Process the image to get the mask
      const { mask, originalImageUrl } = await processImage(file, quality);
      setOriginalImage(originalImageUrl);
      
      // Step 2: Apply the mask to create the final transparent image
      const result = await finalizeImage(originalImageUrl, mask);
      setProcessedImage(result);
    } catch (err) {
      setError(`Failed to process image: ${err.message || 'Unknown error'}`);
      console.error('Error processing image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Apply quality adjustment and reprocess the image
   */
  const handleAdjustmentApply = async () => {
    if (currentFile) {
      setIsProcessing(true);
      await processImageWithQuality(currentFile);
      setIsAdjusting(false);
    }
  };

  /**
   * Reset the application state to try another image
   */
  const handleTryAgain = () => {
    setProcessedImage(null);
    setOriginalImage(null);
    setCurrentFile(null);
    setFileName('');
    setError(null);
  };

  return (
    <div className="App">
      <ModernHeader />
      <main>
        {/* Upload Area - shown when no image is being processed or displayed */}
        {!isProcessing && !processedImage && (
          <UploadArea 
            onImageSelect={handleImageSelect} 
          />
        )}
        
        {/* Loading Spinner - shown during processing */}
        {isProcessing && <ModernSpinner />}
        
        {/* Error Message - shown if processing fails */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Results View - shown after successful processing */}
        {processedImage && !isAdjusting && (
          <ResultsView 
            processedImage={processedImage}
            originalImage={originalImage}
            fileName={fileName}
            onAdjust={() => setIsAdjusting(true)}
            onTryAgain={handleTryAgain}
          />
        )}
        
        {/* Image Adjuster - shown when adjusting quality */}
        {isAdjusting && (
          <div className="adjustment-container">
            <ImageAdjuster
              quality={quality}
              onQualityChange={setQuality}
              onApply={handleAdjustmentApply}
              onCancel={() => setIsAdjusting(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
