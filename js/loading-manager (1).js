// Loading Manager for LMSA
// Manages loading states and progress indication during app initialization

/**
 * Loading Manager Class
 * Controls loading overlay, progress updates, and smooth transitions
 */
class LoadingManager {
    constructor() {
        this.loadingOverlay = null;
        this.loadingProgress = null;
        this.loadingStages = {
            core: null,
            mobile: null,
            features: null
        };
        this.currentStage = 'core';
        this.isComplete = false;
        this.startTime = performance.now();
        
        this.init();
    }

    /**
     * Initialize loading manager
     */
    init() {
        // Get DOM elements
        this.loadingOverlay = document.getElementById('app-loading-overlay');
        this.loadingProgress = document.getElementById('loading-progress');
        
        this.loadingStages.core = document.getElementById('stage-core');
        this.loadingStages.mobile = document.getElementById('stage-mobile');
        this.loadingStages.features = document.getElementById('stage-features');
        
        // Set initial state
        this.updateProgress('Initializing core systems...', 'core');
        
        console.log('[LoadingManager] Initialized');
    }

    /**
     * Update loading progress
     * @param {string} message - Progress message to display
     * @param {string} stage - Current stage (core, mobile, features)
     */
    updateProgress(message, stage = null) {
        if (!this.loadingProgress) return;
        
        // Update progress text
        this.loadingProgress.textContent = message;
        
        // Update stage indicators
        if (stage && stage !== this.currentStage) {
            // Mark previous stage as completed
            if (this.currentStage && this.loadingStages[this.currentStage]) {
                this.loadingStages[this.currentStage].classList.remove('active');
                this.loadingStages[this.currentStage].classList.add('completed');
            }
            
            // Mark current stage as active
            if (this.loadingStages[stage]) {
                this.loadingStages[stage].classList.add('active');
            }
            
            this.currentStage = stage;
        }
        
        console.log(`[LoadingManager] ${message}${stage ? ` (${stage})` : ''}`);
    }

    /**
     * Update progress for mobile optimization loading
     */
    updateMobileProgress(status) {
        if (status === 'detecting') {
            this.updateProgress('Detecting mobile device...', 'mobile');
        } else if (status === 'loading') {
            this.updateProgress('Loading mobile optimizations...', 'mobile');
        } else if (status === 'applying') {
            this.updateProgress('Applying performance optimizations...', 'mobile');
        } else if (status === 'complete') {
            this.updateProgress('Mobile optimizations ready', 'features');
        }
    }

    /**
     * Update progress for feature loading
     */
    updateFeatureProgress(feature) {
        const messages = {
            'touch-handlers': 'Initializing touch handlers...',
            'event-handlers': 'Setting up event handlers...',
            'ui-manager': 'Loading UI components...',
            'chat-service': 'Initializing chat system...',
            'file-upload': 'Setting up file handling...',
            'character-system': 'Loading character system...',
            'settings': 'Loading settings...',
            'complete': 'Finalizing initialization...'
        };
        
        const message = messages[feature] || `Loading ${feature}...`;
        this.updateProgress(message, 'features');
    }

    /**
     * Mark loading as complete and hide overlay
     */
    complete() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        const loadTime = Math.round(performance.now() - this.startTime);
        
        // Mark final stage as completed
        if (this.currentStage && this.loadingStages[this.currentStage]) {
            this.loadingStages[this.currentStage].classList.remove('active');
            this.loadingStages[this.currentStage].classList.add('completed');
        }
        
        this.updateProgress(`Ready! (${loadTime}ms)`);
        
        console.log(`[LoadingManager] App loaded in ${loadTime}ms`);
        
        // Wait a moment then hide loading overlay
        setTimeout(() => {
            this.hideLoadingOverlay();
        }, 500);
    }

    /**
     * Hide loading overlay with smooth transition
     */
    hideLoadingOverlay() {
        if (!this.loadingOverlay) return;
        
        // Add fade out animation
        this.loadingOverlay.classList.add('fade-out');
        
        // Hide after animation completes
        setTimeout(() => {
            this.loadingOverlay.classList.add('hidden');
            
            // Show app container with reveal animation
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                appContainer.classList.add('reveal');
            }
            
            // Remove loading overlay from DOM after transition
            setTimeout(() => {
                if (this.loadingOverlay && this.loadingOverlay.parentNode) {
                    this.loadingOverlay.remove();
                }
            }, 500);
            
        }, 500);
        
        console.log('[LoadingManager] Loading overlay hidden');
    }

    /**
     * Show error state
     */
    showError(error) {
        if (!this.loadingProgress) return;
        
        this.loadingProgress.textContent = `Error: ${error}`;
        this.loadingProgress.style.color = '#ef4444';
        
        // Stop spinner animation
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.style.animation = 'none';
            spinner.style.borderTopColor = '#ef4444';
        }
        
        console.error('[LoadingManager] Error:', error);
    }

    /**
     * Force complete loading (for debugging or fallback)
     */
    forceComplete() {
        console.warn('[LoadingManager] Force completing loading');
        this.complete();
    }

    /**
     * Get loading statistics
     */
    getStats() {
        return {
            isComplete: this.isComplete,
            currentStage: this.currentStage,
            loadTime: Math.round(performance.now() - this.startTime),
            stagesCompleted: Object.values(this.loadingStages)
                .filter(stage => stage && stage.classList.contains('completed')).length
        };
    }
}

// Create global loading manager instance
export const loadingManager = new LoadingManager();

// Auto-complete loading after a timeout as fallback
setTimeout(() => {
    if (!loadingManager.isComplete) {
        console.warn('[LoadingManager] Auto-completing loading after timeout');
        loadingManager.complete();
    }
}, 10000); // 10 second timeout

// Export for external use
export { LoadingManager };