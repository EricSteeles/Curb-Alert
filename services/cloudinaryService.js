// Cloudinary Image Upload Service - Simplified Version
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = 'curb_alert_unsigned'; // The preset you just created

export const cloudinaryService = {
  // Upload single image
  async uploadImage(file, options = {}) {
    try {
      // Basic validation
      this.validateImage(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      
      // Optional: Add folder organization
      if (options.folder) {
        formData.append('folder', options.folder);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}: Upload failed`);
      }

      const data = await response.json();
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width || 0,
        height: data.height || 0,
        bytes: data.bytes || 0
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  },

  // Upload multiple images
  async uploadImages(files, options = {}) {
    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadImage(file, {
          ...options,
          folder: options.folder || 'curb_alert_items'
        })
      );
      
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  },

  // Get thumbnail URL (basic version)
  getThumbnailUrl(originalUrl, size = 200) {
    if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
      return originalUrl;
    }

    try {
      // Simple thumbnail transformation for Cloudinary URLs
      return originalUrl.replace('/upload/', `/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`);
    } catch (error) {
      console.error('Error generating thumbnail URL:', error);
      return originalUrl;
    }
  },

  // Get optimized URL
  getOptimizedUrl(originalUrl, transformations = {}) {
    if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
      return originalUrl;
    }

    try {
      let transformString = 'q_auto,f_auto'; // Auto quality and format
      
      if (transformations.width) transformString += `,w_${transformations.width}`;
      if (transformations.height) transformString += `,h_${transformations.height}`;
      if (transformations.crop) transformString += `,c_${transformations.crop}`;

      return originalUrl.replace('/upload/', `/upload/${transformString}/`);
    } catch (error) {
      console.error('Error generating optimized URL:', error);
      return originalUrl;
    }
  },

  // Validate image file
  validateImage(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    return true;
  },

  // Check if service is configured
  isConfigured() {
    return !!(CLOUDINARY_CLOUD_NAME && UPLOAD_PRESET);
  }
};