
class ImageOptimizer {
  constructor() {
    this.supportedFormats = this.checkFormatSupport();
  }

  checkFormatSupport() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    return {
      webp: canvas.toDataURL('image/webp').indexOf('image/webp') === 5,
      avif: canvas.toDataURL('image/avif').indexOf('image/avif') === 5
    };
  }

  // Convert image to WebP if supported
  async convertToWebP(imageFile) {
    if (!this.supportedFormats.webp) {
      return imageFile;
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/webp', 0.8);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  }

  // Compress image
  async compressImage(file, quality = 0.8, maxWidth = 1200) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Generate responsive image sizes
  generateResponsiveSizes(imageUrl) {
    const sizes = [150, 250, 300, 500, 800, 1200];
    const formats = ['webp', 'jpg'];
    
    const responsiveImages = {};
    
    formats.forEach(format => {
      responsiveImages[format] = sizes.map(size => ({
        size,
        url: `${imageUrl}?w=${size}&h=${size}&fit=crop&auto=format&format=${format}`
      }));
    });
    
    return responsiveImages;
  }

  // Create picture element with responsive sources
  createResponsivePicture(imageUrl, alt, className = '') {
    const responsiveImages = this.generateResponsiveSizes(imageUrl);
    
    const picture = document.createElement('picture');
    
    // Add WebP sources if supported
    if (this.supportedFormats.webp) {
      const webpSource = document.createElement('source');
      webpSource.type = 'image/webp';
      webpSource.srcset = responsiveImages.webp
        .map(img => `${img.url} ${img.size}w`)
        .join(', ');
      webpSource.sizes = '(max-width: 480px) 150px, (max-width: 768px) 250px, 300px';
      picture.appendChild(webpSource);
    }
    
    // Add fallback img
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = alt;
    img.loading = 'lazy';
    img.className = className;
    img.srcset = responsiveImages.jpg
      .map(img => `${img.url} ${img.size}w`)
      .join(', ');
    img.sizes = '(max-width: 480px) 150px, (max-width: 768px) 250px, 300px';
    
    picture.appendChild(img);
    
    return picture;
  }
}

// Initialize image optimizer
const imageOptimizer = new ImageOptimizer();

// Make it globally available
window.ImageOptimizer = imageOptimizer;
