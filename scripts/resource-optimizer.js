
class ResourceOptimizer {
  constructor() {
    this.criticalResources = new Set();
    this.nonCriticalResources = new Set();
    this.init();
  }

  init() {
    this.identifyCriticalResources();
    this.preloadCriticalResources();
    this.deferNonCriticalResources();
  }

  identifyCriticalResources() {
    // Mark critical CSS and JS for immediate loading
    this.criticalResources.add('styles/main.css');
    this.criticalResources.add('scripts/app.js');
    this.criticalResources.add('scripts/cart-utils.js');
  }

  preloadCriticalResources() {
    this.criticalResources.forEach(resource => {
      if (!document.querySelector(`link[href="${resource}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
      }
    });
  }

  deferNonCriticalResources() {
    // Defer non-critical scripts
    const nonCriticalScripts = [
      'scripts/performance-monitor.js',
      'scripts/image-optimizer.js',
      'scripts/lazy-loading.js'
    ];

    nonCriticalScripts.forEach(src => {
      const script = document.querySelector(`script[src="${src}"]`);
      if (script && !script.hasAttribute('defer')) {
        script.defer = true;
      }
    });
  }

  // Inline critical CSS to eliminate render-blocking
  inlineCriticalCSS() {
    const criticalCSS = `
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0}
      .navbar{display:flex;align-items:center;justify-content:space-between;padding:20px;background:#c7a1b3}
      .hero{height:100vh;background:linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('first.png') no-repeat center/cover;display:flex;align-items:center;justify-content:center;color:white}
      .product-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:30px}
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }
}

// Initialize resource optimizer
const resourceOptimizer = new ResourceOptimizer();
window.ResourceOptimizer = resourceOptimizer;
