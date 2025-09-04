// Alternative Cloudinary approach using their widget
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

export const cloudinaryWidgetService = {
  // Initialize and open Cloudinary upload widget
  openUploadWidget(callback) {
    if (!window.cloudinary) {
      // Load Cloudinary widget script
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.onload = () => {
        this.createWidget(callback);
      };
      document.head.appendChild(script);
    } else {
      this.createWidget(callback);
    }
  },

  createWidget(callback) {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'curb_alert_unsigned', // Your unsigned preset
        folder: 'curb_alert_items',
        multiple: true,
        maxFiles: 5,
        maxFileSize: 10000000, // 10MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        cropping: false,
        sources: ['local', 'camera'],
        showSkipCropButton: true,
        croppingAspectRatio: 1,
        theme: 'minimal',
        styles: {
          palette: {
            window: '#FFFFFF',
            sourceBg: '#F4F4F5',
            windowBorder: '#90A0B3',
            tabIcon: '#667eea',
            inactiveTabIcon: '#555a5f',
            menuIcons: '#667eea',
            link: '#667eea',
            action: '#667eea',
            inProgress: '#667eea',
            complete: '#10b981',
            error: '#ef4444',
            textDark: '#000000',
            textLight: '#FFFFFF'
          }
        }
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary widget error:', error);
          callback(null, error);
          return;
        }

        if (result && result.event === 'success') {
          const uploadedImage = {
            url: result.info.secure_url,
            publicId: result.info.public_id,
            format: result.info.format,
            width: result.info.width,
            height: result.info.height,
            bytes: result.info.bytes
          };
          callback(uploadedImage, null);
        }
      }
    );

    widget.open();
  }
};