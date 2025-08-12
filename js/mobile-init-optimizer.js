// Mobile Initialization Optimizer
// Optimizes the app initialization process for mobile devices

// Safe logging functions that don't depend on utils.js
const safeLog = (message, ...args) => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log(`[MobileInit] ${message}`, ...args);
    }
};

const safeError = (message, ...args) => {
    console.error(`[MobileInit] ${message}`, ...args);
};

/**
 * Mobile Initialization Optimizer
 * Manages the loading sequence to prioritize mobile performance
 */
class MobileInitOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.criticalModulesLoaded = false;
        this.deferredModules = [];
        this.loadingStages = {
            critical: false,
            interactive: false,
            complete: false
        };
        
        if (this.isMobile) {
            this.optimizeInitialization();
        }
    }

    /**
     * Detect mobile device
     */
    detectMobile() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
        return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
               window.innerWidth <= 768 ||
               'ontouchstart' in window;
    }

    /**
     * Optimize the initialization sequence for mobile
     */
    optimizeInitialization() {
        safeLog('Optimizing initialization for mobile');

        // Stage 1: Critical path - minimal UI and core functionality
        this.loadCriticalPath();

        // Stage 2: Interactive - add interaction handlers
        requestIdleCallback(() => {
            this.loadInteractivePath();
        }, { timeout: 2000 });

        // Stage 3: Complete - load remaining features
        requestIdleCallback(() => {
            this.loadCompletePath();
        }, { timeout: 5000 });
    }

    /**
     * Load only critical functionality first
     */
    async loadCriticalPath() {
        safeLog('Loading critical path for mobile');

        try {
            // Load only essential modules for initial render
            const criticalModules = [
                './dom-elements.js',
                './utils.js',
                './ui-manager.js'
            ];

            // Load critical modules in parallel
            const modulePromises = criticalModules.map(module => 
                this.loadModuleWithTimeout(module, 3000)
            );

            await Promise.all(modulePromises);

            // Mark critical path as loaded
            this.loadingStages.critical = true;
            this.showMinimalUI();

            safeLog('Critical path loaded');

        } catch (error) {
            safeError('Error loading critical path:', error);
            // Fallback to standard initialization
            this.fallbackToStandardInit();
        }
    }

    /**
     * Load interactive functionality
     */
    async loadInteractivePath() {
        if (!this.loadingStages.critical) {
            safeLog('Critical path not ready, deferring interactive path');
            setTimeout(() => this.loadInteractivePath(), 500);
            return;
        }

        safeLog('Loading interactive path for mobile');

        try {
            // Load interaction modules
            const interactiveModules = [
                './event-handlers.js',
                './touch-handlers.js',
                './chat-service.js',
                './api-service.js'
            ];

            // Load with timeout and error handling
            const modulePromises = interactiveModules.map(module =>
                this.loadModuleWithTimeout(module, 5000).catch(error => {
                    safeError(`Failed to load ${module}:`, error);
                    return null; // Continue loading other modules
                })
            );

            await Promise.all(modulePromises);

            // Mark interactive as loaded
            this.loadingStages.interactive = true;
            this.enableInteractions();

            safeLog('Interactive path loaded');

        } catch (error) {
            safeError('Error loading interactive path:', error);
        }
    }

    /**
     * Load complete functionality
     */
    async loadCompletePath() {
        if (!this.loadingStages.interactive) {
            safeLog('Interactive path not ready, deferring complete path');
            setTimeout(() => this.loadCompletePath(), 1000);
            return;
        }

        safeLog('Loading complete path for mobile');

        try {
            // Load remaining modules
            const completeModules = [
                './character-manager.js',
                './character-gallery.js',
                './settings-manager.js',
                './file-upload.js',
                './export-import.js',
                './model-manager.js',
                './whats-new.js'
            ];

            // Load these modules with lower priority
            for (const module of completeModules) {
                // Load one at a time to avoid overwhelming mobile devices
                try {
                    await this.loadModuleWithTimeout(module, 10000);
                    // Small delay between modules to keep UI responsive
                    await this.delay(100);
                } catch (error) {
                    safeError(`Failed to load ${module}:`, error);
                    // Continue loading other modules
                }
            }

            // Mark complete as loaded
            this.loadingStages.complete = true;
            this.enableAllFeatures();

            safeLog('Complete path loaded');

        } catch (error) {
            safeError('Error loading complete path:', error);
        }
    }

    /**
     * Load module with timeout
     */
    loadModuleWithTimeout(moduleUrl, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Module ${moduleUrl} loading timeout`));
            }, timeout);

            import(moduleUrl)
                .then(module => {
                    clearTimeout(timeoutId);
                    resolve(module);
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    reject(error);
                });
        });
    }

    /**
     * Show minimal UI first
     */
    showMinimalUI() {
        // Hide loading indicator if present
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        // Show basic UI elements
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
        }

        // Add mobile-optimized class immediately
        document.body.classList.add('mobile-optimized');

        safeLog('Minimal UI shown');
    }

    /**
     * Enable basic interactions
     */
    enableInteractions() {
        // Enable basic button interactions
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.disabled = false;
            button.classList.remove('loading');
        });

        // Enable sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.style.pointerEvents = 'auto';
        }

        safeLog('Basic interactions enabled');
    }

    /**
     * Enable all features
     */
    enableAllFeatures() {
        // Remove any loading states
        document.body.classList.remove('loading');
        document.body.classList.add('fully-loaded');

        // Enable all interactive elements
        const allInteractives = document.querySelectorAll('[disabled], .disabled');
        allInteractives.forEach(element => {
            element.disabled = false;
            element.classList.remove('disabled');
        });

        safeLog('All features enabled');
    }

    /**
     * Fallback to standard initialization
     */
    fallbackToStandardInit() {
        safeLog('Falling back to standard initialization');
        
        // Remove mobile optimization classes
        document.body.classList.remove('mobile-optimized');
        
        // Show standard loading
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
    }

    /**
     * Delay utility
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get loading status
     */
    getLoadingStatus() {
        return {
            isMobile: this.isMobile,
            stages: { ...this.loadingStages },
            fullyLoaded: Object.values(this.loadingStages).every(stage => stage)
        };
    }

    /**
     * Force load all remaining modules (for debugging)
     */
    async forceLoadAll() {
        safeLog('Force loading all modules');
        
        if (!this.loadingStages.critical) {
            await this.loadCriticalPath();
        }
        
        if (!this.loadingStages.interactive) {
            await this.loadInteractivePath();
        }
        
        if (!this.loadingStages.complete) {
            await this.loadCompletePath();
        }
        
        safeLog('Force load complete');
    }
}

// Create global instance only if on mobile
let mobileInitOptimizer = null;

// Initialize mobile optimization
if (typeof window !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
    const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
                    window.innerWidth <= 768 ||
                    'ontouchstart' in window;
    
    if (isMobile) {
        mobileInitOptimizer = new MobileInitOptimizer();
    }
}

export { mobileInitOptimizer, MobileInitOptimizer };