# LMSA Auth Branch Changelog

## Authentication & Security

### Basic Authentication Support
- Added support for HTTP Basic Authentication with Nginx
- Implemented secure credential storage in localStorage
- Created UI for username/password entry in the settings modal
- Added support for optional authentication (works with or without auth)
- Implemented multi-account support with credential switching

### Secure API Communications
- Refactored all API calls to use consistent authentication headers
- Removed insecure practices of sending credentials in URL parameters
- Implemented proper Basic Auth header encryption
- Ensured all endpoints (models, chat completions, etc.) use the same auth method
- Added secure error handling to prevent credential leakage

### UI/UX Improvements for Authentication
- Added visual feedback for authentication status
- Implemented password visibility toggle
- Added error messages with clear user feedback for auth failures
- Improved form validation and error clearing on input
- Ensured credentials are synced across the application

## Memory Management & Performance

### Timeout Management
- Created a centralized timeout manager (`timeout-manager.js`) to prevent memory leaks
- Implemented automatic tracking and cleanup of timeouts
- Added lifecycle-based cleanup on page visibility changes and unload
- Integrated with existing memory management systems

### Memory Leak Detection & Prevention
- Enhanced memory leak detector to work with the timeout manager
- Improved cleanup of dead references and unused resources
- Added better monitoring of resource usage (timeouts, observers, etc.)
- Implemented detection of stale timeouts and automatic cleanup

### API Service Optimization
- Refactored fetch operations to use managed timeouts
- Improved abort controller usage for better request cancellation
- Enhanced error handling for network requests
- Silenced unnecessary console errors for expected API behaviors

### System Integration
- Integrated timeout manager with memory manager for coordinated cleanup
- Added automated cleanup of very old timeouts
- Improved overall memory usage monitoring
- Implemented proper cleanup of resources during component unmounting

## Syntax Highlighting

### Code Block Syntax Highlighting
- Added local syntax highlighting for code blocks using highlight.js
- Implemented automatic detection and highlighting of multiple programming languages
- Added support for Python, JavaScript, JSON, XML, and other common languages
- Integrated GitHub Dark theme for consistent styling with the app's dark theme
- Created mutation observer to automatically highlight dynamically added code blocks
- Optimized loading with minified highlight.js library for better performance
- Added proper language detection and fallback handling for unknown languages
- Implemented duplicate processing prevention to avoid console spam
- Cleaned up unused highlight.js files to reduce bundle size

## Build & Development Improvements

### Error Handling
- Added better error handling for API calls
- Silenced expected 400/404 errors for unsupported endpoints
- Fixed ReferenceError in file-upload.js
- Improved fallback detection for server capabilities

## Compatibility

- Maintained compatibility with existing LM Studio server APIs
- Ensured backward compatibility with non-auth setups
- Added graceful degradation for unsupported endpoints
- Improved capability detection for different server implementations