import React, { useState, useRef } from 'react';

const PhotoUpload = ({ photos, setPhotos, showNotification }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const maxPhotos = 5;
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    
    if (photos.length + fileArray.length > maxPhotos) {
      showNotification(`Maximum ${maxPhotos} photos allowed`, 'error');
      return;
    }

    fileArray.forEach(file => {
      if (file.size > maxFileSize) {
        showNotification(`File ${file.name} is too large. Maximum size is 10MB`, 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showNotification(`File ${file.name} is not an image`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file,
          name: file.name
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    e.target.value = '';
  };

  const handleCameraCapture = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    e.target.value = '';
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      showNotification('Could not access camera. Please check permissions.', 'error');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `captured-${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleFiles([file]);
          stopCamera();
          showNotification('Photo captured successfully!', 'success');
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="photo-upload">
      <label>
        Photos <span className="badge">Optional</span>
      </label>
      
      {!isCapturing ? (
        <div
          className={`photo-upload-area ${isDragActive ? 'drag-active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">
            <i className="fas fa-camera"></i>
          </div>
          <h4>Add Photos</h4>
          <p>Drag & drop images here, or click to select</p>
          <div className="upload-buttons">
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <i className="fas fa-folder-open"></i> Choose Files
            </button>
            
            {/* Mobile Camera Capture */}
            {isMobile && (
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
              >
                <i className="fas fa-camera"></i> Take Photo
              </button>
            )}
            
            {/* Desktop Camera Access */}
            {!isMobile && (
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
              >
                <i className="fas fa-video"></i> Use Camera
              </button>
            )}
          </div>
          <small>Maximum {maxPhotos} photos, up to 10MB each</small>
        </div>
      ) : (
        <div className="camera-capture">
          <div className="camera-viewfinder">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          <div className="camera-controls">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={stopCamera}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary capture-btn"
              onClick={capturePhoto}
            >
              <i className="fas fa-camera"></i> Capture
            </button>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {/* Mobile camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        style={{ display: 'none' }}
      />

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="photo-preview-grid">
          {photos.map(photo => (
            <div key={photo.id} className="photo-preview">
              <img src={photo.url} alt={photo.name || 'Uploaded photo'} />
              <button
                type="button"
                className="remove-photo"
                onClick={() => removePhoto(photo.id)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
          {photos.length < maxPhotos && (
            <div 
              className="add-more-photos"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="fas fa-plus"></i>
              <span>Add More</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;