
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
    }

    this.observeImages();
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
    if (element.tagName === 'IMG') {
      if (element.dataset.src) {
        element.src = element.dataset.src;
        element.removeAttribute('data-src');
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

    element.classList.add('lazy-loaded');
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
