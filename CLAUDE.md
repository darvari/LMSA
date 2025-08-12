# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LMSA (LM Studio Assistant) is a modern web-based AI chat interface designed to work with LM Studio servers. It's a client-side web application built with vanilla JavaScript, HTML, and CSS that connects to local LM Studio instances for AI conversations.

## Architecture

### Core Structure
- **Frontend-only application**: No build process or server - runs directly in browser
- **Modular ES6 architecture**: All JavaScript organized as ES6 modules in `/js/` directory
- **Mobile-first design**: Extensive mobile optimizations and touch handlers
- **Local storage**: All data stored client-side in localStorage (chats, settings, characters)

### Key Components

**Entry Points:**
- `index.html` - Main HTML file with embedded CSS and initialization
- `js/app.js` - Application bootstrap, imports main.js
- `js/main.js` - Primary initialization and module orchestration

**Core Services:**
- `js/api-service.js` - LM Studio server communication and model management
- `js/chat-service.js` - Chat functionality, message handling, streaming
- `js/settings-manager.js` - Application settings and user preferences
- `js/ui-manager.js` - UI state management and DOM manipulation

**Feature Modules:**
- `js/character-manager.js` - AI character creation and management
- `js/character-gallery.js` - Character selection interface
- `js/file-upload.js` - File and image upload handling
- `js/export-import.js` - Chat data export/import functionality
- `js/memory-manager.js` - Memory optimization and cleanup

**Performance & Mobile:**
- `js/mobile-performance-optimizer.js` - Mobile-specific optimizations
- `js/performance-optimizer.js` - General performance monitoring
- `js/memory-leak-detector.js` - Memory usage monitoring
- `js/touch-handlers.js` - Touch interaction management

**CSS Organization:**
- `css/styles.css` - Main styles
- `css/mobile-optimizations.css` - Mobile-specific optimizations
- `css/theme-variables.css` - CSS custom properties for theming
- Component-specific CSS files for modals and features

### Data Flow

1. **Initialization**: `app.js` → `main.js` → service modules
2. **Settings**: Loaded from localStorage on startup via `settings-manager.js`
3. **API Communication**: `api-service.js` handles all LM Studio server requests
4. **Chat Flow**: User input → `chat-service.js` → API call → streaming response → UI update
5. **Persistence**: All data stored in localStorage (no backend database)

## Development Commands

**No build system required** - this is a static web application that runs directly in browsers.

### Testing
- **Manual testing**: Open `index.html` in browser or serve with local HTTP server
- **LM Studio required**: Application requires running LM Studio server for full functionality
- **CORS setup**: Enable CORS in LM Studio server settings

### Local Development
```bash
# Simple HTTP server for testing
python -m http.server 8000
# or
npx http-server
```

## Key Technical Considerations

### Mobile Performance
- Extensive touch event handling throughout codebase
- Performance monitoring and optimization for mobile devices
- Memory management to prevent leaks on mobile browsers
- Responsive design with mobile-first approach

### LM Studio Integration
- Connects to local LM Studio server via REST API
- Supports model switching and server configuration
- Handles streaming responses for real-time chat
- Vision model support for image uploads

### Memory Management
- Active memory monitoring and cleanup routines
- Chat message virtualization for large conversations
- File upload cleanup and optimization
- Periodic memory leak detection

### Character System
- JSON-based character cards with customizable personalities
- Character gallery with image support
- System prompt integration with characters
- Character continuation modal for seamless transitions

## File Structure Notes

- All JavaScript files are ES6 modules with explicit imports/exports
- Touch handlers are separated into individual files for each component
- CSS is split by functionality (mobile, themes, components)
- No TypeScript or preprocessors - vanilla JavaScript throughout
- Local storage keys follow pattern: `lmsa_*` for settings, timestamps for chats

## Common Development Patterns

### Error Handling
- Use `debugLog()` and `debugError()` from `utils.js` for consistent logging
- Graceful degradation for mobile/performance limitations
- Server connection error handling with user feedback

### Mobile Touch Events
- All interactive elements have touch handlers
- Passive event listeners for performance
- Touch feedback and haptic responses where supported

### State Management
- Local storage for persistence
- Module-level state variables exported as needed
- Shared state managed through `shared-state.js`

### Performance Optimization
- Lazy loading for large datasets
- RAF-based animations and smooth scrolling
- Memory cleanup routines and monitoring
- Conditional loading of mobile optimizations