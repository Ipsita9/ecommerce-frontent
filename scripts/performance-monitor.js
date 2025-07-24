
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.metricsLogged = false;
    this.init();
  }

  init() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      this.measurePageLoad();
      this.measureImageLoading();
      this.measureLargestContentfulPaint();
    });
  }

  measurePageLoad() {
    if ('performance' in window && 'timing' in window.performance) {
      const timing = window.performance.timing;
      
      // Wait for timing to be complete and valid
      if (timing.loadEventEnd > 0 && timing.navigationStart > 0 && timing.loadEventEnd > timing.navigationStart) {
        const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
        const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        // Only calculate if values are positive and reasonable
        if (pageLoadTime > 0 && pageLoadTime < 60000 && domContentLoadedTime > 0) {
          this.metrics.pageLoad = {
            total: pageLoadTime,
            domContentLoaded: domContentLoadedTime,
            firstPaint: this.getFirstPaint()
          };
          
          // Log only once and only if not already logged
          if (!this.metricsLogged) {
            console.log('Page Performance Metrics:', this.metrics.pageLoad);
            this.metricsLogged = true;
          }
        }
      }
    }
  }

  getFirstPaint() {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const paintEntries = window.performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : null;
    }
    return null;
  }

  measureImageLoading() {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;
    
    const startTime = performance.now();
    
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            const endTime = performance.now();
            this.metrics.imageLoading = {
              totalImages,
              loadTime: endTime - startTime
            };
            console.log('Image Loading Metrics:', this.metrics.imageLoading);
          }
        });
      }
    });
  }

  measureLargestContentfulPaint() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        console.log('Largest Contentful Paint:', this.metrics.lcp);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  // Report performance metrics
  getMetrics() {
    return this.metrics;
  }

  // Log performance recommendations
  getRecommendations() {
    const recommendations = [];
    
    if (this.metrics.pageLoad && this.metrics.pageLoad.total > 3000) {
      recommendations.push('Page load time is over 3 seconds. Consider optimizing images and reducing file sizes.');
    }
    
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push('Largest Contentful Paint is over 2.5 seconds. Optimize your largest image or text block.');
    }
    
    return recommendations;
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Make it globally available
window.PerformanceMonitor = performanceMonitor;
