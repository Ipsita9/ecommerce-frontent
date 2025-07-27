
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.contentObserver = null;
    this.loadedImages = new Set();
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            this.loadImage(element);
            observer.unobserve(element);
          }
        });
      }, {
        rootMargin: '100px 0px', // Increased for better UX
        threshold: 0.01
      });

      // Observer for non-essential content
      this.contentObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            this.loadNonEssentialContent(element);
            observer.unobserve(element);
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.1
      });
    }

    this.observeImages();
    this.observeNonEssentialContent();
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]');
    
    if (this.imageObserver) {
      lazyImages.forEach(img => {
        this.imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      lazyImages.forEach(img => {
        this.loadImage(img);
      });
    }
  }

  loadImage(element) {
    const elementId = element.src || element.dataset.src || Math.random().toString(36);
    
    if (this.loadedImages.has(elementId)) return;
    this.loadedImages.add(elementId);

    if (element.tagName === 'IMG') {
      // Add loading placeholder
      element.style.backgroundColor = '#f0f0f0';
      
      if (element.dataset.src) {
        // Preload image for smoother loading
        const img = new Image();
        img.onload = () => {
          element.src = element.dataset.src;
          element.removeAttribute('data-src');
          element.style.backgroundColor = '';
          element.classList.add('lazy-loaded');
        };
        img.onerror = () => {
          element.src = 'placeholder.png';
          element.classList.add('lazy-error');
        };
        img.src = element.dataset.src;
      }
      
      if (element.dataset.srcset) {
        element.srcset = element.dataset.srcset;
        element.removeAttribute('data-srcset');
      }
    } else if (element.tagName === 'SOURCE') {
      if (element.dataset.srcset) {
        element.srcset = element.dataset.srcset;
        element.removeAttribute('data-srcset');
      }
    }
  }

  loadNonEssentialContent(element) {
    // Load non-essential scripts and content
    if (element.hasAttribute('data-lazy-script')) {
      const script = document.createElement('script');
      script.src = element.getAttribute('data-lazy-script');
      script.async = true;
      document.head.appendChild(script);
      element.removeAttribute('data-lazy-script');
    }
    
    // Load third-party content
    if (element.hasAttribute('data-lazy-content')) {
      element.innerHTML = element.getAttribute('data-lazy-content');
      element.removeAttribute('data-lazy-content');
    }
  }

  observeNonEssentialContent() {
    const lazyContent = document.querySelectorAll('[data-lazy-script], [data-lazy-content]');
    
    if (this.contentObserver) {
      lazyContent.forEach(element => {
        this.contentObserver.observe(element);
      });
    }
  }

  // Method to add new images dynamically
  addNewImages() {
    this.observeImages();
  }
}

// Initialize lazy loading
const lazyLoader = new LazyImageLoader();

// Make it globally available
window.LazyImageLoader = lazyLoader;
