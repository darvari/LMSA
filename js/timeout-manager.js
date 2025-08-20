// Timeout Manager
// Provides a central system to manage timeouts and prevent memory leaks

import { debugLog } from './utils.js';

/**
 * Timeout Manager
 * 
 * Provides a centralized system to manage setTimeout and clearTimeout
 * to prevent memory leaks due to uncancelled timeouts.
 */
class TimeoutManager {
    constructor() {
        this.timeouts = new Map(); // Maps timeoutId -> { id, name, timestamp }
        this.idCounter = 0;
        this.cleanupInterval = null;
        this.initialized = false;
        this.autoCleanupEnabled = true;
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the timeout manager
     */
    init() {
        if (this.initialized) return;
        
        // Start the auto cleanup process if enabled
        if (this.autoCleanupEnabled) {
            this.startAutoCleanup();
        }
        
        // Enable cleanup on page visibility change or unload
        this.setupPageLifecycleCleanup();
        
        debugLog('Timeout manager initialized');
        this.initialized = true;
    }
    
    /**
     * Sets a timeout with automatic tracking
     * 
     * @param {Function} callback - Function to execute after the delay
     * @param {number} delay - Delay in milliseconds
     * @param {string} name - Optional name for the timeout for debugging
     * @returns {Object} - An object with id and clear method
     */
    setTimeout(callback, delay, name = '') {
        const id = ++this.idCounter;
        
        // Wrap the callback to ensure it's removed from tracking after execution
        const wrappedCallback = (...args) => {
            try {
                // Remove from tracking before executing to prevent re-registration issues
                this.timeouts.delete(timeoutId);
                
                // Execute the original callback
                callback(...args);
            } catch (error) {
                console.error('Error in timeout callback:', error);
            }
        };
        
        // Create the actual timeout
        const timeoutId = setTimeout(wrappedCallback, delay);
        
        // Store metadata for tracking
        this.timeouts.set(timeoutId, {
            id,
            name: name || `timeout-${id}`,
            timestamp: Date.now(),
            delay
        });
        
        // Create a clear function that uses our clearTimeout method
        const clear = () => this.clearTimeout(timeoutId);
        
        // Return an object with the id and clear method
        return { id: timeoutId, clear };
    }
    
    /**
     * Clears a timeout and removes it from tracking
     * 
     * @param {number} timeoutId - The timeout ID to clear
     */
    clearTimeout(timeoutId) {
        if (timeoutId) {
            // Clear the actual timeout
            clearTimeout(timeoutId);
            
            // Remove from tracking
            this.timeouts.delete(timeoutId);
        }
    }
    
    /**
     * Clears all tracked timeouts
     */
    clearAllTimeouts() {
        const count = this.timeouts.size;
        
        if (count > 0) {
            this.timeouts.forEach((_, timeoutId) => {
                clearTimeout(timeoutId);
            });
            
            this.timeouts.clear();
            debugLog(`Cleared ${count} timeouts`);
        }
    }
    
    /**
     * Start automatic cleanup of long-expired timeouts
     */
    startAutoCleanup() {
        // Check for expired timeouts every 2 minutes
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredTimeouts();
        }, 2 * 60 * 1000);
    }
    
    /**
     * Clean up timeouts that should have expired by now
     * This is a safety net for timeouts that never executed for some reason
     */
    cleanupExpiredTimeouts() {
        const now = Date.now();
        let cleaned = 0;
        
        this.timeouts.forEach((info, timeoutId) => {
            const { timestamp, delay, name } = info;
            
            // If the timeout was created more than delay + 10 seconds ago, it's likely expired
            const expectedExpiration = timestamp + delay + 10000;
            if (now > expectedExpiration) {
                this.clearTimeout(timeoutId);
                cleaned++;
                
                debugLog(`Cleaned up stale timeout: ${name} (ID: ${timeoutId}), created ${Math.round((now - timestamp)/1000)}s ago`);
            }
        });
        
        if (cleaned > 0) {
            debugLog(`Auto-cleaned ${cleaned} expired timeouts`);
        }
    }
    
    /**
     * Sets up cleanup on page visibility change or unload
     */
    setupPageLifecycleCleanup() {
        // Clean up on page hidden (when user switches tabs or minimizes)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                // Only clean up long-running timeouts (> 10s) when page is hidden
                // to avoid breaking necessary UI animations
                this.timeouts.forEach((info, timeoutId) => {
                    if (info.delay > 10000) {
                        this.clearTimeout(timeoutId);
                    }
                });
            }
        });
        
        // Clean up everything on page unload
        window.addEventListener('beforeunload', () => {
            this.clearAllTimeouts();
            if (this.cleanupInterval) {
                clearInterval(this.cleanupInterval);
            }
        });
    }
    
    /**
     * Get statistics about current timeouts
     * 
     * @returns {Object} - Stats about timeouts
     */
    getStats() {
        const now = Date.now();
        
        // Count timeouts by age
        let oldTimeouts = 0;
        let veryOldTimeouts = 0;
        
        this.timeouts.forEach(({ timestamp }) => {
            const age = now - timestamp;
            
            if (age > 60000) { // Older than 1 minute
                oldTimeouts++;
            }
            
            if (age > 5 * 60000) { // Older than 5 minutes
                veryOldTimeouts++;
            }
        });
        
        return {
            total: this.timeouts.size,
            oldTimeouts,
            veryOldTimeouts,
        };
    }
}

// Create singleton instance
export const timeoutManager = new TimeoutManager();

/**
 * Utility functions for easier usage
 */

/**
 * Sets a timeout using the timeout manager
 * 
 * @param {Function} callback - Function to execute after the delay
 * @param {number} delay - Delay in milliseconds
 * @param {string} name - Optional name for the timeout for debugging
 * @returns {Object} - An object with id and clear method
 */
export function setManagedTimeout(callback, delay, name = '') {
    return timeoutManager.setTimeout(callback, delay, name);
}

/**
 * Clears a timeout using the timeout manager
 * 
 * @param {number|Object} timeout - The timeout ID or the object returned by setManagedTimeout
 */
export function clearManagedTimeout(timeout) {
    if (typeof timeout === 'number') {
        timeoutManager.clearTimeout(timeout);
    } else if (timeout && typeof timeout.clear === 'function') {
        timeout.clear();
    }
}

// Export default for convenience
export default timeoutManager;
