import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadArea.css';

function UploadArea({ onImageSelect }) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const [dragError, setDragError] = useState(null);

  const onDropAccepted = useCallback(files => {
    setDragError(null);
    const file = files[0];
    onImageSelect(file);
  }, [onImageSelect]);

  const onDropRejected = useCallback(fileRejections => {
    const rejection = fileRejections[0];
    if (rejection.errors[0].code === 'file-too-large') {
      setDragError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    } else if (rejection.errors[0].code === 'file-invalid-type') {
      setDragError('Invalid file type. Please upload a JPG, PNG or JPEG image.');
    } else {
      setDragError('Error uploading file. Please try again.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false,
    maxSize: MAX_FILE_SIZE
  });

  return (
    <div className="upload-container">
      <div 
        {...getRootProps()} 
        className={`modern-dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="upload-content">
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <h2>Remove Background</h2>
          <p className="upload-description">
            {isDragActive 
              ? "Drop image here" 
              : "100% automatic and free"}
          </p>
          <button className="upload-button">Upload Image</button>
        </div>
      </div>
      {dragError && <div className="upload-error">{dragError}</div>}
    </div>
  );
}

export default UploadArea;
