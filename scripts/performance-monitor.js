
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

  // Monitor Core Web Vitals
  measureCoreWebVitals() {
    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = entry.processingStart - entry.startTime;
          console.log('First Input Delay:', this.metrics.fid);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
        console.log('Cumulative Layout Shift:', this.metrics.cls);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Monitor resource loading
  measureResourceTiming() {
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      const resources = window.performance.getEntriesByType('resource');
      
      this.metrics.resources = {
        slowestResource: null,
        totalSize: 0,
        totalTime: 0,
        count: resources.length
      };
      
      let slowestTime = 0;
      resources.forEach(resource => {
        const duration = resource.responseEnd - resource.startTime;
        this.metrics.resources.totalTime += duration;
        
        if (duration > slowestTime) {
          slowestTime = duration;
          this.metrics.resources.slowestResource = {
            name: resource.name,
            duration: Math.round(duration),
            size: resource.transferSize || 0
          };
        }
        
        this.metrics.resources.totalSize += resource.transferSize || 0;
      });
      
      console.log('Resource Timing:', this.metrics.resources);
    }
  }

  // Report performance metrics
  getMetrics() {
    this.measureCoreWebVitals();
    this.measureResourceTiming();
    return this.metrics;
  }

  // Enhanced performance recommendations
  getRecommendations() {
    const recommendations = [];
    
    if (this.metrics.pageLoad && this.metrics.pageLoad.total > 3000) {
      recommendations.push('⚠️ Page load time is over 3 seconds. Consider optimizing images and reducing file sizes.');
    }
    
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push('🎯 LCP is over 2.5 seconds. Optimize your largest image or text block.');
    }
    
    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push('⏱️ First Input Delay is over 100ms. Reduce JavaScript execution time.');
    }
    
    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push('📐 Cumulative Layout Shift is high. Set explicit dimensions for images and containers.');
    }
    
    if (this.metrics.resources && this.metrics.resources.slowestResource && this.metrics.resources.slowestResource.duration > 1000) {
      recommendations.push(`🐌 Slowest resource: ${this.metrics.resources.slowestResource.name} (${this.metrics.resources.slowestResource.duration}ms)`);
    }
    
    return recommendations;
  }

  // Auto-optimize based on metrics
  autoOptimize() {
    const recommendations = this.getRecommendations();
    if (recommendations.length > 0) {
      console.group('🚀 Performance Recommendations:');
      recommendations.forEach(rec => console.log(rec));
      console.groupEnd();
    }
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Make it globally available
window.PerformanceMonitor = performanceMonitor;
