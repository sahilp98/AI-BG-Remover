import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader/ImageUploader';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = (file) => {
    setIsProcessing(true);
    // TODO: Implement image processing
    console.log('Selected file:', file);
    setTimeout(() => setIsProcessing(false), 1000); // Temporary for testing
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Background Remover</h1>
      </header>
      <main>
        <ImageUploader onImageSelect={handleImageSelect} />
        {isProcessing && <p>Processing image...</p>}
      </main>
    </div>
  );
}

export default App;
