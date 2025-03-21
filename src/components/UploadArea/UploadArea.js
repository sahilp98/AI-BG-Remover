import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadArea.css';

function UploadArea({ onImageSelect }) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(files => {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        alert('File size must be less than 5MB');
        return;
      }
      onImageSelect(file);
    }, [onImageSelect]),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false,
    maxSize: MAX_FILE_SIZE
  });

  return (
    <div className="upload-container">
      <div {...getRootProps()} className="modern-dropzone">
        <input {...getInputProps()} />
        <div className="upload-content">
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          <h2>Upload Image</h2>
          <p>{isDragActive ? "Drop image here" : "Drop image here or click to upload"}</p>
          <button className="upload-button">Choose File</button>
        </div>
      </div>
    </div>
  );
}

export default UploadArea;
