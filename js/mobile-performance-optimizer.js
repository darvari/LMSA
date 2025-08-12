// Mobile Performance Optimizer for LMSA
// Optimizes performance specifically for mid-tier mobile devices

// Safe logging functions that don't depend on utils.js
const safeLog = (message, ...args) => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log(`[MobilePerf] ${message}`, ...args);
    }
};

const safeError = (message, ...args) => {
    console.error(`[MobilePerf] ${message}`, ...args);
};

/**
 * Mobile Performance Optimizer Class
 * Handles performance optimizations specific to mobile devices
 */
class MobilePerformanceOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isMidTier = this.detectMidTierDevice();
        this.optimizationsApplied = new Set();
        this.deferredTasks = [];
        this.criticalResourcesLoaded = false;
        this.startTime = performance.now();
        this.fpsMonitoringFrame = null;
        
        if (this.isMobile) {
            this.init();
        }
    }

    /**
     * Detect if device is mobile
     */
    detectMobile() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
        return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
    }

    /**
     * Detect if device is mid-tier (slower mobile device)
     */
    detectMidTierDevice() {
        // Check for performance indicators
        const hardwareConcurrency = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 2;
        const connection = navigator.connection;
        
        // Consider mid-tier if:
        // - Low CPU cores (<=2)
        // - Low RAM (<=2GB)
        // - Slow connection
        const lowCpu = hardwareConcurrency <= 2;
        const lowMemory = memory <= 2;
        const slowConnection = connection && 
            (connection.effectiveType === '2g' || 
             connection.effectiveType === 'slow-2g' ||
             connection.effectiveType === '3g');

        return lowCpu || lowMemory || slowConnection;
    }

    /**
     * Initialize mobile optimizations
     */
    init() {
        safeLog('Initializing mobile performance optimizations');
        
        // Apply critical optimizations immediately
        this.applyCriticalOptimizations();
        
        // Defer non-critical optimizations
        this.deferNonCriticalOptimizations();
        
        // Setup performance monitoring
        this.setupMobileMonitoring();
        
        safeLog(`Mobile optimizations applied. Mid-tier device: ${this.isMidTier}`);
    }

    /**
     * Apply critical optimizations for initial load
     */
    applyCriticalOptimizations() {
        // 1. Reduce sidebar animation complexity
        this.optimizeSidebarAnimation();
        
        // 2. Optimize touch handlers
        this.optimizeTouchHandlers();
        
        // 3. Reduce initial JavaScript execution
        this.reduceInitialJSExecution();
        
        // 4. Optimize CSS for mobile
        this.optimizeCSSForMobile();
        
        // 5. Implement lazy loading
        this.implementLazyLoading();
    }

    /**
     * Optimize sidebar animation for mobile
     */
    optimizeSidebarAnimation() {
        if (this.optimizationsApplied.has('sidebar')) return;
        
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        // Create mobile-optimized styles
        const mobileStyles = document.createElement('style');
        mobileStyles.id = 'mobile-sidebar-optimizations';
        
        let css = `
            /* Mobile sidebar optimizations */
            @media screen and (max-width: 768px) {
                #sidebar {
                    /* Faster, simpler animation for mobile */
                    transition: transform 0.15s ease-out !important;
                    /* Remove complex gradients and shadows on mobile */
                    background: var(--modern-bg-primary) !important;
                    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1) !important;
                    /* Force hardware acceleration */
                    transform: translateZ(0);
                    will-change: transform;
                    backface-visibility: hidden;
                }
                
                /* Reduce complexity of sidebar items on mobile */
                .sidebar-section {
                    background-color: var(--modern-bg-secondary) !important;
                    border-radius: 0.5rem !important;
                    transition: none !important;
                }
                
                .section-header {
                    transition: background-color 0.1s ease !important;
                }
                
                .menu-item {
                    transition: background-color 0.1s ease !important;
                }
                
                /* Remove hover effects on mobile to reduce repaints */
                .section-header:hover,
                .menu-item:hover {
                    transition: none !important;
                }
            }
        `;

        // Additional optimizations for mid-tier devices
        if (this.isMidTier) {
            css += `
                @media screen and (max-width: 768px) {
                    /* Even more aggressive optimizations for mid-tier */
                    #sidebar {
                        transition: transform 0.1s linear !important;
                        background: #1e293b !important;
                        box-shadow: none !important;
                    }
                    
                    .sidebar-section {
                        background: #334155 !important;
                        border-radius: 0.25rem !important;
                        margin: 0.25rem !important;
                    }
                    
                    /* Disable all hover effects */
                    * {
                        -webkit-tap-highlight-color: transparent !important;
                    }
                }
            `;
        }

        mobileStyles.textContent = css;
        document.head.appendChild(mobileStyles);
        
        this.optimizationsApplied.add('sidebar');
        safeLog('Sidebar optimizations applied');
    }

    /**
     * Optimize touch handlers for mobile performance
     */
    optimizeTouchHandlers() {
        if (this.optimizationsApplied.has('touch')) return;

        // Throttle touch events more aggressively on mobile
        const throttledTouchMove = this.throttle((e) => {
            // Handle touch move with minimal processing
        }, this.isMidTier ? 32 : 16); // ~30fps for mid-tier, ~60fps for better devices

        // Add passive event listeners where possible
        // Exclude file input elements to prevent interference with file selection
        const touchElements = document.querySelectorAll('#sidebar, .messages-container, #user-input');
        const fileInputElements = document.querySelectorAll('input[type="file"]');
        const filteredElements = Array.from(touchElements).filter(el => 
            !Array.from(fileInputElements).some(fileInput => fileInput === el || fileInput.contains(el) || el.contains(fileInput))
        );
        
        filteredElements.forEach(element => {
            // Remove existing touch handlers that might be too complex
            element.addEventListener('touchstart', (e) => {
                // Minimal touch start handling
                if (this.isMidTier) {
                    // Disable selection on mid-tier devices for better performance
                    e.target.style.userSelect = 'none';
                }
            }, { passive: true });

            element.addEventListener('touchmove', throttledTouchMove, { passive: true });

            element.addEventListener('touchend', (e) => {
                // Re-enable selection
                if (this.isMidTier) {
                    e.target.style.userSelect = '';
                }
            }, { passive: true });
        });

        this.optimizationsApplied.add('touch');
        safeLog('Touch handler optimizations applied to', filteredElements.length, 'elements');
        safeLog('File input elements excluded:', fileInputElements.length);
    }

    /**
     * Reduce initial JavaScript execution
     */
    reduceInitialJSExecution() {
        if (this.optimizationsApplied.has('js-execution')) return;

        // Defer non-critical JavaScript execution
        const deferredModules = [
            './character-gallery.js',
            './export-import.js',
            './whats-new.js',
            './about.js',
            './help.js'
        ];

        // Load these modules only when needed or after initial render
        this.deferredTasks.push(() => {
            deferredModules.forEach(module => {
                this.loadModuleWhenIdle(module);
            });
        });

        // Use requestIdleCallback for non-critical tasks
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.executeDeferredTasks();
            }, { timeout: 5000 });
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                this.executeDeferredTasks();
            }, 2000);
        }

        this.optimizationsApplied.add('js-execution');
        safeLog('JavaScript execution optimization applied');
    }

    /**
     * Optimize CSS for mobile devices
     */
    optimizeCSSForMobile() {
        if (this.optimizationsApplied.has('css-mobile')) return;

        const mobileCSS = document.createElement('style');
        mobileCSS.id = 'mobile-performance-css';
        
        let css = `
            /* Mobile performance optimizations */
            @media screen and (max-width: 768px) {
                /* Disable expensive CSS properties */
                /* Exclude input elements to prevent interference with file selection */
                *:not(input):not(input[type="file"]) {
                    /* Reduce the number of layers */
                    transform-style: flat !important;
                }
                
                /* Optimize animations */
                .fade-in,
                .fade-out,
                .slide-in,
                .slide-out {
                    animation-duration: 0.15s !important;
                }
                
                /* Simplify gradients */
                .gradient-bg {
                    background: var(--modern-bg-primary) !important;
                }
                
                /* Reduce shadow complexity */
                .shadow-lg,
                .shadow-xl {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                }
                
                /* Optimize text rendering */
                body {
                    -webkit-font-smoothing: auto !important;
                    text-rendering: auto !important;
                }
                
                /* Force GPU acceleration for key elements */
                #sidebar,
                .messages-container,
                #user-input {
                    transform: translateZ(0);
                    backface-visibility: hidden;
                }
            }
        `;

        if (this.isMidTier) {
            css += `
                @media screen and (max-width: 768px) {
                    /* Aggressive optimizations for mid-tier devices */
                    /* Exclude input elements to prevent interference with file selection */
                    *:not(input):not(input[type="file"]) {
                        transition: none !important;
                        animation: none !important;
                    }
                    
                    /* Keep only essential transitions */
                    #sidebar {
                        transition: transform 0.1s linear !important;
                    }
                    
                    /* Disable complex visual effects */
                    .blur,
                    .backdrop-blur {
                        backdrop-filter: none !important;
                        -webkit-backdrop-filter: none !important;
                    }
                    
                    /* Simplify borders */
                    /* Exclude input elements to prevent interference with file selection */
                    *:not(input):not(input[type="file"]) {
                        border-radius: 0.25rem !important;
                    }
                }
            `;
        }

        mobileCSS.textContent = css;
        document.head.appendChild(mobileCSS);

        this.optimizationsApplied.add('css-mobile');
        safeLog('Mobile CSS optimizations applied');
    }

    /**
     * Implement lazy loading for mobile
     */
    implementLazyLoading() {
        if (this.optimizationsApplied.has('lazy-loading')) return;

        // Lazy load images
        const images = document.querySelectorAll('img[src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            images.forEach(img => {
                if (img.src) {
                    img.dataset.src = img.src;
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
                    imageObserver.observe(img);
                }
            });
        }

        this.optimizationsApplied.add('lazy-loading');
        safeLog('Lazy loading implemented');
    }

    /**
     * Setup performance monitoring specific to mobile
     */
    setupMobileMonitoring() {
        if (this.optimizationsApplied.has('monitoring')) return;

        // Monitor FPS for mobile performance (only in development)
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            let frameCount = 0;
            let lastTime = performance.now();
            let fpsAnimationFrame = null;
            
            const checkFPS = () => {
                frameCount++;
                const currentTime = performance.now();
                
                if (currentTime - lastTime >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                    
                    if (fps < 30) {
                        safeLog(`Low FPS detected: ${fps}, applying emergency optimizations`);
                        this.applyEmergencyOptimizations();
                    }
                    
                    frameCount = 0;
                    lastTime = currentTime;
                }
                
                // Only continue monitoring for 30 seconds, then stop
                if (currentTime - this.startTime < 30000) {
                    fpsAnimationFrame = requestAnimationFrame(checkFPS);
                } else {
                    safeLog('FPS monitoring stopped after 30 seconds');
                }
            };
            
            fpsAnimationFrame = requestAnimationFrame(checkFPS);
            
            // Store reference for cleanup
            this.fpsMonitoringFrame = fpsAnimationFrame;
        }

        this.optimizationsApplied.add('monitoring');
    }

    /**
     * Apply emergency optimizations when performance is critically low
     */
    applyEmergencyOptimizations() {
        safeLog('Applying emergency performance optimizations');
        
        // Disable all animations
        const emergencyCSS = document.createElement('style');
        emergencyCSS.id = 'emergency-performance';
        emergencyCSS.textContent = `
            * {
                transition: none !important;
                animation: none !important;
                transform: none !important;
            }
            
            #sidebar {
                transition: opacity 0.1s linear !important;
            }
        `;
        document.head.appendChild(emergencyCSS);
        
        // Reduce update frequency
        window.mobilePerformanceMode = 'emergency';
    }

    /**
     * Execute deferred tasks
     */
    executeDeferredTasks() {
        safeLog('Executing deferred tasks');
        this.deferredTasks.forEach(task => {
            try {
                task();
            } catch (error) {
                safeError('Error executing deferred task:', error);
            }
        });
        this.deferredTasks = [];
    }

    /**
     * Load module when system is idle
     */
    loadModuleWhenIdle(moduleUrl) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
                try {
                    await import(moduleUrl);
                    safeLog(`Lazy loaded module: ${moduleUrl}`);
                } catch (error) {
                    safeError(`Error lazy loading module ${moduleUrl}:`, error);
                }
            });
        }
    }

    /**
     * Throttle function for better mobile performance
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Defer non-critical optimizations
     */
    deferNonCriticalOptimizations() {
        // These optimizations can wait until after initial render
        this.deferredTasks.push(() => {
            this.optimizeScrolling();
            this.optimizeMemoryUsage();
            this.setupVisibilityChangeOptimizations();
        });
    }

    /**
     * Optimize scrolling performance
     */
    optimizeScrolling() {
        const scrollableElements = document.querySelectorAll('.messages-container, #chat-history, #sidebar');
        
        scrollableElements.forEach(element => {
            element.style.scrollBehavior = 'auto'; // Disable smooth scrolling on mobile
            element.style.overscrollBehavior = 'contain'; // Prevent bounce scrolling
            
            if (this.isMidTier) {
                // More aggressive optimizations for mid-tier devices
                element.style.willChange = 'auto';
                element.style.transform = 'translateZ(0)';
            }
        });
    }

    /**
     * Optimize memory usage for mobile
     */
    optimizeMemoryUsage() {
        // More aggressive garbage collection on mobile
        if (this.isMidTier) {
            setInterval(() => {
                if (document.visibilityState === 'hidden') {
                    // Clean up when app is backgrounded
                    const event = new Event('mobile-cleanup');
                    document.dispatchEvent(event);
                }
            }, 30000);
        }
    }

    /**
     * Setup optimizations based on visibility changes
     */
    setupVisibilityChangeOptimizations() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                // Pause non-essential operations
                this.pauseNonEssentialOperations();
            } else {
                // Resume operations
                this.resumeOperations();
            }
        });
    }

    /**
     * Pause non-essential operations when app is backgrounded
     */
    pauseNonEssentialOperations() {
        // Pause animations
        console.log('Mobile optimizer: Adding performance-mode class');
        document.body.classList.add('performance-mode');
        
        // Clear any running intervals that aren't critical
        if (window.performanceMonitorInterval) {
            clearInterval(window.performanceMonitorInterval);
        }
    }

    /**
     * Resume operations when app becomes visible
     */
    resumeOperations() {
        console.log('Mobile optimizer: Removing performance-mode class');
        document.body.classList.remove('performance-mode');
        
        // Resume performance monitoring if needed
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            this.setupMobileMonitoring();
        }
    }

    /**
     * Get current mobile performance status
     */
    getPerformanceStatus() {
        return {
            isMobile: this.isMobile,
            isMidTier: this.isMidTier,
            optimizationsApplied: Array.from(this.optimizationsApplied),
            deferredTasksRemaining: this.deferredTasks.length
        };
    }

    /**
     * Cleanup mobile optimizer resources
     */
    cleanup() {
        // Stop FPS monitoring
        if (this.fpsMonitoringFrame) {
            cancelAnimationFrame(this.fpsMonitoringFrame);
            this.fpsMonitoringFrame = null;
            safeLog('FPS monitoring cleanup completed');
        }
    }
}

// Global instance
export const mobileOptimizer = new MobilePerformanceOptimizer();

// Export for manual control
export { MobilePerformanceOptimizer };