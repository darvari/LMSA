let API_URL = ''; // Fix ReferenceError for API_URL
let availableModels = []; // Track available model IDs to avoid ReferenceError

/**
 * Builds the full server URL for a given endpoint using current settings
 * @param {string} endpoint - The API endpoint (e.g. '/v1/models')
 * @returns {string} - The full server URL
 */
export function getServerUrl(endpoint = '') {
    const serverIpInput = document.getElementById('server-ip');
    const serverPortInput = document.getElementById('server-port');
    const sslSwitch = document.getElementById('server-ssl-switch');
    
    let host = serverIpInput?.value.trim() || '';
    let port = serverPortInput?.value.trim() || '';
    let useSSL = sslSwitch && sslSwitch.checked;

    // If user enters a full URL, parse protocol and host
    let parsedHost = host;
    let parsedSSL = useSSL;
    if (/^https?:\/\//i.test(host)) {
        const urlObj = new URL(host);
        parsedHost = urlObj.hostname;
        parsedSSL = urlObj.protocol === 'https:';
        if (!port && urlObj.port) {
            port = urlObj.port;
        }
    }

    // Force SSL for public domains (not local IPs)
    if (!parsedSSL && parsedHost && !/^((localhost)|(127\.)|(10\.)|(192\.168\.)|(172\.(1[6-9]|2[0-9]|3[0-1])))/.test(parsedHost)) {
        parsedSSL = true;
    }

    if (parsedSSL && !port) port = '443';
    if (!parsedSSL && !port) port = '1234';
    
    // Omit port for standard protocols
    let omitPort = (parsedSSL && port === '443') || (!parsedSSL && port === '80');
    let url = `${parsedSSL ? 'https' : 'http'}://${parsedHost}`;
    if (port && !omitPort) url += `:${port}`;
    if (endpoint) url += endpoint;
    return url;
}
// Test server response utility
export async function testServerResponse() {
    const resultDiv = document.getElementById('test-server-result');
    if (!resultDiv) return;

    resultDiv.textContent = 'Testing...';
    
    // Use our getServerUrl function for the URL and getAuthHeaders for authentication
    const url = getServerUrl('/v1/models');
    const headers = await getAuthHeaders(); // await here

    // Log auth information for debugging (safely)
    const useAuthSwitch = document.getElementById('use-auth-switch');
    const authUsername = document.getElementById('auth-username');
    const isAuthEnabled = useAuthSwitch && useAuthSwitch.checked;
    const hasUsername = authUsername && authUsername.value.trim().length > 0;
    
    console.log('Auth Debug:', {
        authEnabled: isAuthEnabled,
        hasUsername: hasUsername,
        hasAuthHeader: !!headers['Authorization'],
        url: url
    });
    
    fetch(url, { 
        method: 'GET',
        headers: headers
    })
        .then(async response => {
            // For debugging - check what the server responds with
            let responseBody = '';
            try {
                // Try to get response text for more info about the error
                responseBody = await response.text();
            } catch (e) {
                responseBody = '(unable to read response body)';
            }
            
            if (response.ok) {
                resultDiv.textContent = `✅ Server responded with status 200 OK.`;
                resultDiv.classList.remove('error-message');
                resultDiv.classList.add('success-message');
                console.log('Auth Success:', responseBody.substring(0, 100) + '...');
            } else if (response.status === 401) {
                // Check if this is an nginx auth failure
                const isNginx = responseBody.includes('nginx') || 
                               (response.headers && response.headers.get('server') && 
                                response.headers.get('server').includes('nginx'));
                
                if (isNginx) {
                    resultDiv.innerHTML = `❌ Nginx authentication failed. <br>
                        <span class="text-xs">This is likely because you're using nginx as a reverse proxy.<br>
                        Make sure your nginx configuration includes:</span>
                        <pre class="text-xs mt-1 p-1 bg-gray-700 rounded">proxy_set_header Authorization $http_authorization;
proxy_pass_header Authorization;</pre>`;
                } else {
                    resultDiv.textContent = `❌ Authentication failed (status 401). Check your username and password.`;
                }
                
                resultDiv.classList.remove('success-message');
                resultDiv.classList.add('error-message');
                
                // Log details for debugging
                console.error('Auth Failure Details:', {
                    status: response.status,
                    isNginx: isNginx,
                    headers: Object.fromEntries(response.headers.entries()),
                    responseText: responseBody
                });
                
                // Add visual indicator by temporarily highlighting the auth fields
                highlightAuthFields();
            } else {
                resultDiv.textContent = `❌ Server responded with status ${response.status}.`;
                resultDiv.classList.remove('success-message');
                resultDiv.classList.add('error-message');
                console.error('Server Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    responseText: responseBody
                });
            }
        })
        .catch(err => {
            resultDiv.textContent = `❌ Error: ${err.message}`;
            resultDiv.classList.remove('success-message');
            resultDiv.classList.add('error-message');
            console.error('Fetch Error:', err);
        });
}
/**
 * Briefly highlight auth fields to indicate authentication error
 */
function highlightAuthFields() {
    const authFields = document.querySelectorAll('#auth-username, #auth-password');
    const useAuthSwitch = document.getElementById('use-auth-switch');
    const authErrorMessage = document.getElementById('auth-error-message');
    
    // If auth is enabled, highlight the fields
    if (useAuthSwitch && useAuthSwitch.checked) {
        // Show detailed error message if possible
        if (authErrorMessage) {
            authErrorMessage.textContent = 'Authentication failed. Check your username and password are correct and that the server requires authentication.';
            authErrorMessage.classList.remove('hidden');
        }
        
        // Highlight the fields
        authFields.forEach(field => {
            field.classList.add('auth-error');
            setTimeout(() => {
                field.classList.remove('auth-error');
            }, 2000); // Remove highlight after 2 seconds
        });
    }
}

/**
 * Decode and validate a Basic Auth header for debugging
 * @param {string} authHeader - The Authorization header value 
 * @returns {Object} - The decoded credentials or error
 */
function debugDecodeBasicAuth(authHeader) {
    try {
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return { valid: false, error: 'Not a Basic Auth header' };
        }
        
        const base64Credentials = authHeader.split(' ')[1];
        const decodedCredentials = atob(base64Credentials);
        const [username, password] = decodedCredentials.split(':');
        
        return {
            valid: true,
            username: username,
            hasPassword: !!password,
            passwordLength: password ? password.length : 0
        };
    } catch (error) {
        return {
            valid: false,
            error: error.message
        };
    }
}

// Attach test button event listener on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const testBtn = document.getElementById('test-server-btn');
    if (testBtn) {
        testBtn.addEventListener('click', testServerResponse);
    }
});
// API Service for handling server communication
import { serverIpInput, serverPortInput, loadedModelDisplay } from './dom-elements.js';
import { getLightThemeEnabled } from './settings-manager.js';

/**
 * Get authentication headers if authentication is enabled
 * @returns {Object} - Headers object with Authorization header if authentication is enabled
 */
export async function getAuthHeaders() {
    const useAuthSwitch = document.getElementById('use-auth-switch');
    
    // Create base headers - always include Content-Type
    const headers = {
        'Content-Type': 'application/json'
    };
    
    try {
        // Only add auth header if auth is enabled
        if (useAuthSwitch && useAuthSwitch.checked) {
            const authUsername = document.getElementById('auth-username');
            const authPassword = document.getElementById('auth-password');
            
            if (authUsername && authPassword) {
                const username = authUsername.value.trim();
                const password = authPassword.value.trim();
                
                if (username && password) {
                    // Ensure proper encoding for special characters in credentials
                    const base64Credentials = btoa(unescape(encodeURIComponent(`${username}:${password}`)));
                    headers['Authorization'] = `Basic ${base64Credentials}`;
                    
                    // Debug logging to help troubleshoot auth issues
                    const isNginxAuth = username.toLowerCase().includes('nginx') || 
                                      window.location.hostname.includes('nginx') ||
                                      window.location.hostname.includes('baldwiniv');
                    
                    console.log('Auth headers created for ' + (isNginxAuth ? 'nginx' : 'standard'), {
                        hasUsername: !!username,
                        hasPassword: !!password,
                        headerSet: !!headers['Authorization'],
                    });
                    
                    // Store credentials securely if available
                    try {
                        await storeSecureCredentials(username, password);
                    } catch (storageError) {
                        // Non-critical error, just log and continue
                        console.log('Could not store credentials securely:', storageError.message);
                    }
                } else {
                    console.warn('Authentication is enabled but username or password is empty');
                }
            }
        }
    } catch (error) {
        console.error('Error creating auth headers:', error);
        
        // Even in case of error, still try to add Authorization header with basic fallback
        try {
            const authUsername = document.getElementById('auth-username');
            const authPassword = document.getElementById('auth-password');
            
            if (authUsername && authPassword && authUsername.value && authPassword.value) {
                // Fallback to a simpler encoding method if the main one fails
                const base64Credentials = btoa(`${authUsername.value}:${authPassword.value}`);
                headers['Authorization'] = `Basic ${base64Credentials}`;
                console.log('Added fallback auth header after error');
            }
        } catch (fallbackError) {
            console.error('Error creating fallback auth header:', fallbackError);
        }
    }
    
    return headers;
}

/**
 * Store credentials securely using Capacitor Secure Storage
 * @param {string} username - Username to store
 * @param {string} password - Password to store
 * @returns {Promise<boolean>} - True if successful
 */
export async function storeSecureCredentials(username, password) {
    try {
        // Check if we're in Capacitor environment
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SecureStorage) {
            await window.Capacitor.Plugins.SecureStorage.set({
                key: 'auth_credentials',
                value: JSON.stringify({ username, password })
            });
            console.log('Credentials stored securely');
            return true;
        } else {
            // Fallback for web/development
            console.warn('Secure Storage not available, falling back to localStorage');
            localStorage.setItem('auth-username', username);
            localStorage.setItem('auth-password', btoa(password));
            return true;
        }
    } catch (error) {
        console.error('Failed to store credentials:', error);
        return false;
    }
}

/**
 * Get credentials from secure storage
 * @returns {Promise<Object>} - Object with username and password
 */
export async function getSecureCredentials() {
    try {
        // Check if we're in Capacitor environment
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SecureStorage) {
            const result = await window.Capacitor.Plugins.SecureStorage.get({ key: 'auth_credentials' });
            if (result && result.value) {
                const credentials = JSON.parse(result.value);
                return {
                    username: credentials.username,
                    password: credentials.password
                };
            }
        } else {
            // Fallback for web/development
            console.warn('Secure Storage not available, falling back to localStorage');
            const username = localStorage.getItem('auth-username');
            const password = localStorage.getItem('auth-password');
            return {
                username,
                password: password ? atob(password) : null
            };
        }
    } catch (error) {
        console.error('Failed to retrieve credentials:', error);
    }
    
    // Return empty credentials if anything fails
    return { username: null, password: null };
}

/**
 * Remove credentials from secure storage
 * @returns {Promise<boolean>} - True if successful
 */
export async function removeSecureCredentials() {
    try {
        // Check if we're in Capacitor environment
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SecureStorage) {
            await window.Capacitor.Plugins.SecureStorage.remove({ key: 'auth_credentials' });
            console.log('Credentials removed securely');
            return true;
        } else {
            // Fallback for web/development
            localStorage.removeItem('auth-username');
            localStorage.removeItem('auth-password');
            return true;
        }
    } catch (error) {
        console.error('Failed to remove credentials:', error);
        return false;
    }
}

/**
 * Updates the server URL based on IP and port inputs
 */
export async function updateServerUrl() {
    const host = serverIpInput.value.trim(); // now can be IP or domain
    let port = serverPortInput.value.trim();
    const sslSwitch = document.getElementById('server-ssl-switch');
    const useSSL = sslSwitch && sslSwitch.checked;

    // Clear any previous validation errors
    clearValidationErrors();

    // Host is required
    if (!host) {
        showValidationError('Host is required');
        return;
    }

    // If user enters a full URL, parse protocol and host
    let parsedHost = host;
    let parsedSSL = useSSL;
    if (/^https?:\/\//i.test(host)) {
        const urlObj = new URL(host);
        parsedHost = urlObj.hostname;
        parsedSSL = urlObj.protocol === 'https:';
        if (!port && urlObj.port) {
            port = urlObj.port;
        }
    }

    // If SSL is enabled and no port, default to 443
    if (parsedSSL && !port) {
        port = '443';
        const serverPortInput = document.getElementById('server-port');
        if (serverPortInput) serverPortInput.value = '443';
    }
    // If not using SSL and no port, default to 1234
    if (!parsedSSL && !port) {
        port = '1234';
        const serverPortInput = document.getElementById('server-port');
        if (serverPortInput) serverPortInput.value = '1234';
    }

    // If port is provided, include it in the URL
    let url;
    if (port) {
        url = `${parsedSSL ? 'https' : 'http'}://${parsedHost}:${port}/v1/chat/completions`;
    } else {
        url = `${parsedSSL ? 'https' : 'http'}://${parsedHost}/v1/chat/completions`;
    }
    API_URL = url;
    
    // Save server settings
    localStorage.setItem('serverIp', parsedHost);
    localStorage.setItem('serverPort', port);
    localStorage.setItem('serverSSL', parsedSSL ? 'true' : 'false');
    
    // Save authentication settings if enabled
    const useAuthSwitch = document.getElementById('use-auth-switch');
    const authUsername = document.getElementById('auth-username');
    const authPassword = document.getElementById('auth-password');
    
    if (useAuthSwitch && useAuthSwitch.checked && authUsername && authPassword) {
        // Use secure storage instead of localStorage
        await storeSecureCredentials(authUsername.value, authPassword.value);
    }
    
    fetchAvailableModels();
}

/**
 * Shows validation error for IP/Port fields
 */
function showValidationError() {
    const ip = serverIpInput.value.trim();
    const port = serverPortInput.value.trim();
    
    // Add error styling to both fields
    serverIpInput.style.borderColor = '#ef4444';
    serverPortInput.style.borderColor = '#ef4444';
    
    // Show error message
    let errorContainer = document.getElementById('ip-port-error');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'ip-port-error';
        errorContainer.className = 'text-red-400 text-xs mt-1';
        
        // Insert after the IP/Port container
        const ipPortContainer = document.querySelector('.ip-port-container');
        if (ipPortContainer && ipPortContainer.parentNode) {
            ipPortContainer.parentNode.insertBefore(errorContainer, ipPortContainer.nextSibling);
        }
    }
    
    if (ip && !port) {
        errorContainer.textContent = 'Port is required when IP address is specified';
    } else if (!ip && port) {
        errorContainer.textContent = 'IP address is required when Port is specified';
    }
}

/**
 * Clears validation errors for IP/Port fields
 */
function clearValidationErrors() {
    // Remove error styling
    serverIpInput.style.borderColor = '';
    serverPortInput.style.borderColor = '';
    
    // Remove error message
    const errorContainer = document.getElementById('ip-port-error');
    if (errorContainer) {
        errorContainer.remove();
    }
}

/**
 * Fetches available models from the server
 * @returns {Promise<Array>} - Array of available model objects
 */
export async function fetchAvailableModels() {
    try {
        if (!serverIpInput || !serverPortInput) {
            console.error('Server IP or port input elements not found');
            return [];
        }

        // Build the full models endpoint URL
        const modelsUrl = getServerUrl('/v1/models');

        // Add a timeout to the fetch request to prevent long waits
        const controller = new AbortController();
        
        // Import and use the timeout manager for better memory management
        let timeoutHandle;
        try {
            // Dynamic import to avoid circular dependencies
            const { setManagedTimeout } = await import('./timeout-manager.js');
            timeoutHandle = setManagedTimeout(() => controller.abort(), 5000, 'fetch-models-timeout');
        } catch (e) {
            // Fallback to regular setTimeout if the timeout manager isn't available
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            timeoutHandle = { clear: () => clearTimeout(timeoutId) };
        }

        try {
            // get auth headers properly
            const authHeaders = await getAuthHeaders();

            const modelsResponse = await fetch(modelsUrl, {
                signal: controller.signal,
                headers: authHeaders
            });

            // Clear the timeout using the manager or the fallback
            timeoutHandle.clear();

            if (!modelsResponse.ok) {
                console.error('Failed to fetch models, server returned:', modelsResponse.status, modelsResponse.statusText);
                
                // Check specifically for authentication failures
                if (modelsResponse.status === 401) {
                    console.error('Authentication failed when fetching models');
                    // If we have a UI element to show auth errors, update it
                    const authErrorElement = document.getElementById('auth-error-message');
                    if (authErrorElement) {
                        authErrorElement.textContent = 'Authentication failed. Please check your username and password.';
                        authErrorElement.classList.remove('hidden');
                        highlightAuthFields();
                    }
                }
                
                availableModels = []; // Ensure availableModels is empty
                if (loadedModelDisplay) {
                    loadedModelDisplay.classList.add('hidden');
                }
                return [];
            }

            const data = await modelsResponse.json();

            if (!data || !data.data || !Array.isArray(data.data)) {
                console.error('Invalid response format from server:', data);
                availableModels = []; // Ensure availableModels is empty
                if (loadedModelDisplay) {
                    loadedModelDisplay.classList.add('hidden');
                }
                return [];
            }

            const modelsList = data.data;

            // Try to determine which model is loaded through multiple methods

            // Method 1: Look for status flags in the API response directly - add more possible attributes to check
            let loadedModelInfo = modelsList.find(model =>
                model.ready === true ||
                model.loaded === true ||
                model.active === true ||
                model.current === true ||
                model.status === 'loaded' ||
                model.status === 'ready' ||
                model.state === 'loaded' ||
                model.state === 'ready' ||
                model.status === 'active' ||
                model.state === 'active'
            );

            // Method 2: If no model is marked as loaded, check if we can get info via a different endpoint
            if (!loadedModelInfo) {
                try {
                    // Try different endpoints that LM Studio might use
                    const endpoints = [
                        '/v1/internal/model/info',
                        '/v1/model/info',
                        '/v1/models/info',
                        '/v1/models/current'
                    ];

                    // Log once that we're checking model info endpoints
                    console.log('Checking alternative model info endpoints (some 400 errors are expected and can be ignored)');
                    
                    for (const endpoint of endpoints) {
                        try {
                            const controller = new AbortController();
                            
                            // Use the timeout manager for better memory management
                            let timeoutHandle;
                            try {
                                // Dynamic import to avoid circular dependencies
                                const { setManagedTimeout } = await import('./timeout-manager.js');
                                timeoutHandle = setManagedTimeout(() => controller.abort(), 2000, 'model-info-timeout');
                            } catch (e) {
                                // Fallback to regular setTimeout if the timeout manager isn't available
                                const timeoutId = setTimeout(() => controller.abort(), 2000);
                                timeoutHandle = { clear: () => clearTimeout(timeoutId) };
                            }

                            // get auth headers for each probe (await!)
                            const probeAuthHeaders = await getAuthHeaders();

                            // Use fetch with a catch handler to silently handle HTTP errors
                            const modelInfoResponse = await fetch(getServerUrl(endpoint), {
                                method: 'GET',
                                signal: controller.signal,
                                headers: probeAuthHeaders
                            }).catch(() => {
                                // Silently catch network errors and HTTP errors
                                return { ok: false };
                            });

                            // Clear the timeout using the manager or the fallback
                            timeoutHandle.clear();

                            if (modelInfoResponse.ok) {
                                const modelInfo = await modelInfoResponse.json();

                                if (modelInfo && modelInfo.id) {
                                    // Find the matching model in our list
                                    loadedModelInfo = modelsList.find(model => model.id === modelInfo.id);
                                    if (loadedModelInfo) {
                                        console.log('Found loaded model through info endpoint:', loadedModelInfo.id);
                                        break;
                                    }
                                }
                            } else {
                                // Don't log errors for expected 400 responses
                            }
                        } catch (endpointError) {
                            // Don't log the full error, just note that it wasn't available
                            console.log(`Endpoint ${endpoint} not supported by this LM Studio version`);
                        }
                    }
                } catch (infoError) {
                    console.log('Info endpoints not available or no model loaded:', infoError);
                }
            }

            // Method 3: If we still couldn't detect a loaded model, try making a simple completion request
            // This will help detect if a model is actually loaded even if the API doesn't report it
            if (!loadedModelInfo && modelsList.length > 0) {
                try {
                    const controller = new AbortController();
                    
                    // Use the timeout manager for better memory management
                    let timeoutHandle;
                    try {
                        // Dynamic import to avoid circular dependencies
                        const { setManagedTimeout } = await import('./timeout-manager.js');
                        timeoutHandle = setManagedTimeout(() => controller.abort(), 3000, 'chat-test-timeout');
                    } catch (e) {
                        // Fallback to regular setTimeout if the timeout manager isn't available
                        const timeoutId = setTimeout(() => controller.abort(), 3000);
                        timeoutHandle = { clear: () => clearTimeout(timeoutId) };
                    }

                    // get auth headers for each probe
                    const chatAuthHeaders = await getAuthHeaders();
                    const chatResponse = await fetch(getServerUrl('/v1/chat/completions'), {
                        method: 'POST',
                        headers: {
                            ...chatAuthHeaders,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messages: [
                                { role: 'system', content: 'You are a helpful assistant.' },
                                { role: 'user', content: 'test' }
                            ],
                            max_tokens: 1,
                            stream: false
                        }),
                        signal: controller.signal
                    }).catch(() => {
                        return { ok: false };
                    });

                    timeoutHandle.clear();

                    if (chatResponse.ok) {
                        const result = await chatResponse.json();

                        if (result && result.model) {
                            // Find this model in our list
                            loadedModelInfo = modelsList.find(model => model.id === result.model);
                            if (!loadedModelInfo && modelsList.length > 0) {
                                // If we can't find the exact model but know one is loaded, use the first one
                                console.log('Model from completion API not in list, assuming first model');
                                loadedModelInfo = modelsList[0];
                            }
                        }
                    } else {
                        console.log('Completion API not available or no model loaded');
                    }
                } catch (completionError) {
                    console.log('Error checking completion API:', completionError);
                }
            }

            // Method 4: Use the previously stored model if it's in the list
            if (!loadedModelInfo && window.currentLoadedModel) {
                const matchingModel = modelsList.find(model => model.id === window.currentLoadedModel);
                if (matchingModel) {
                    console.log('Using previously stored loaded model:', window.currentLoadedModel);
                    loadedModelInfo = matchingModel;
                }
            }

            if (loadedModelInfo) {
                // We found a loaded model
                availableModels = [loadedModelInfo.id];

                // Store the loaded model name in a global variable for easy access
                window.currentLoadedModel = loadedModelInfo.id;
                
                // Update file upload capabilities now that we have a model
                try {
                    const { updateFileUploadCapabilities } = await import('./file-upload.js');
                    await updateFileUploadCapabilities();
                } catch (error) {
                    console.error('Failed to update file upload capabilities after model detection:', error);
                }

                // Check saved banner visibility preference before showing
                const modelBannerVisible = localStorage.getItem('modelBannerVisible');

                if (modelBannerVisible !== 'false') {
                    // Only show the banner if it wasn't explicitly hidden by the user
                    updateLoadedModelDisplay(loadedModelInfo.id);

                    // Ensure the model banner is visible
                    if (loadedModelDisplay) {
                        loadedModelDisplay.classList.remove('hidden');
                    }
                } else {
                    // Remove the banner completely from DOM
                    const modelWrapper = document.getElementById('loaded-model-wrapper');
                    if (modelWrapper) {
                        modelWrapper.remove();
                        // Reset the CSS variable to 0
                        document.documentElement.style.setProperty('--loaded-model-height', '0px');
                    }
                }
            } else {
                // No loaded model found in the API response
                console.log('No loaded model found after all detection methods');
                availableModels = []; // No model is truly loaded
                window.currentLoadedModel = null; // Clear the global variable
                console.log('Cleared global currentLoadedModel');

                // Check if the banner was manually shown by the user
                const manuallyShown = loadedModelDisplay &&
                                    (loadedModelDisplay.dataset.manuallyShown === 'true');

                // Check if the banner was shown recently (within the last 10 seconds)
                const manuallyShownAt = localStorage.getItem('modelBannerManuallyShownAt');
                const recentlyShown = manuallyShownAt &&
                                    (Date.now() - parseInt(manuallyShownAt)) < 10000; // 10 seconds

                // Only hide the model banner if it wasn't manually shown by user
                if (!manuallyShown && !recentlyShown) {
                    hideLoadedModelDisplay();
                } else {
                    console.log('Banner was manually shown by user, keeping it visible even with no model loaded');
                    // If the banner is already showing, make sure it still shows "No model loaded"
                    if (loadedModelDisplay && !loadedModelDisplay.classList.contains('hidden')) {
                        loadedModelDisplay.textContent = 'No model loaded';
                        loadedModelDisplay.dataset.hasLoadedModel = 'false';
                    }
                }
            }

            // Return the full model data for UI display
            return modelsList;
        } catch (fetchError) {
            // Properly clear managed timeout on error
            if (timeoutHandle && typeof timeoutHandle.clear === 'function') {
                timeoutHandle.clear();
            }
            console.error('Error fetching models:', fetchError);
            availableModels = []; // Ensure availableModels is empty
            if (loadedModelDisplay) {
                loadedModelDisplay.classList.add('hidden');
            }
            return [];
        }
    } catch (error) {
        console.error('Unexpected error in fetchAvailableModels:', error);
        availableModels = []; // Ensure availableModels is empty
        if (loadedModelDisplay) {
            loadedModelDisplay.classList.add('hidden');
        }
        return [];
    }
}

/**
 * Updates the loaded model display
 * @param {string} modelName - The name of the loaded model
 * @param {boolean} forceShow - Whether to force showing the banner regardless of settings (no longer used)
 */
export function updateLoadedModelDisplay(modelName, forceShow = false) {
    if (loadedModelDisplay) {
        // Always update global variable with current model name
        window.currentLoadedModel = modelName;

        // Update the text content (even though it's hidden)
        loadedModelDisplay.textContent = `Loaded Model: ${modelName}`;

        // Set data attribute to indicate a model is loaded
        loadedModelDisplay.dataset.hasLoadedModel = 'true';

        // Banner is always hidden now, so we don't need to show it
        // Just ensure the CSS variable is set to 0
        document.documentElement.style.setProperty('--loaded-model-height', '0px');

        // Update welcome message position (with banner hidden)
        import('./ui-manager.js').then(module => {
            // Check if welcome message is visible before adjusting its position
            const welcomeMessage = document.getElementById('welcome-message');
            if (welcomeMessage && welcomeMessage.style.display !== 'none') {
                module.ensureWelcomeMessagePosition();
            }
        });
    }
}

/**
 * Removes the loaded model display completely
 */
export function hideLoadedModelDisplay(saveState = true) {
    // Remove the wrapper completely from DOM
    const modelWrapper = document.getElementById('loaded-model-wrapper');
    if (modelWrapper) {
        modelWrapper.remove();
        // Reset the CSS variable to 0
        document.documentElement.style.setProperty('--loaded-model-height', '0px');
    }

    // Always store banner state as hidden
    localStorage.setItem('modelBannerVisible', 'false');

    // Update welcome message position
    import('./ui-manager.js').then(module => {
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage && welcomeMessage.style.display !== 'none') {
            module.ensureWelcomeMessagePosition();
        }
    });

    // Don't clear the global model variable when hiding the banner
    // This ensures the models modal still recognizes the loaded model even when the banner is hidden
}

/**
 * Checks if the server is running
 * @returns {Promise<boolean>} - True if server is running, false otherwise
 */
export async function isServerRunning() {
    try {
        // Use the shared URL builder for the models endpoint
        const modelsUrl = getServerUrl('/v1/models');

        // Add a timeout to the fetch request to prevent long waits
        const controller = new AbortController();
        
        // Use the timeout manager for better memory management
        let timeoutHandle;
        try {
            // Dynamic import to avoid circular dependencies
            const { setManagedTimeout } = await import('./timeout-manager.js');
            timeoutHandle = setManagedTimeout(() => controller.abort(), 5000, 'server-check-timeout');
        } catch (e) {
            // Fallback to regular setTimeout if the timeout manager isn't available
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            timeoutHandle = { clear: () => clearTimeout(timeoutId) };
        }

        try {
            // Get authentication headers properly
            const authHeaders = await getAuthHeaders(); // await here
            
            const response = await fetch(modelsUrl, {
                method: 'GET',
                headers: authHeaders,  // Use awaited headers
                signal: controller.signal
            });

            timeoutHandle.clear();
            return response.ok;
        } catch (fetchError) {
            timeoutHandle.clear();
            console.error('Error checking server status:', fetchError);
            return false;
        }
    } catch (error) {
        console.error('Unexpected error in isServerRunning:', error);
        return false;
    }
}

/**
 * Try different known LM Studio API endpoints for an operation
 * @param {string} ip - Server IP
 * @param {string} port - Server port
 * @param {string} operation - Operation name for logging
 * @param {Array} endpoints - Array of endpoint objects with path and method
 * @param {Object} requestData - Request data to send
 * @returns {Promise<boolean>} - True if any endpoint succeeds
 */
async function tryEndpoints(ip, port, operation, endpoints, requestData = null) {
    for (const endpoint of endpoints) {
        try {
            console.log(`Trying ${operation} with endpoint: ${endpoint.path}`);

            const controller = new AbortController();
            
            // Use the timeout manager for better memory management
            let timeoutHandle;
            try {
                // Dynamic import to avoid circular dependencies
                const { setManagedTimeout } = await import('./timeout-manager.js');
                timeoutHandle = setManagedTimeout(() => controller.abort(), 5000, 'endpoint-try-timeout');
            } catch (e) {
                // Fallback to regular setTimeout if the timeout manager isn't available
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                timeoutHandle = { clear: () => clearTimeout(timeoutId) };
            }

            // Get auth headers with same format as other requests
            const authHeaders = await getAuthHeaders(); // await here
            
            console.log(`Auth headers for ${operation}:`, Object.keys(authHeaders));
            
            const options = {
                method: endpoint.method,
                headers: authHeaders,  // Use awaited headers
                signal: controller.signal
            };

            // Always include a body for POST/PUT methods, even if it's an empty object
            if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
                options.body = JSON.stringify(requestData || {});
            }

            const response = await fetch(getServerUrl(endpoint.path), options)
                .catch(err => {
                    console.log(`Network error with ${endpoint.path}: ${err.name === 'AbortError' ? 'timeout' : 'connection failed'}`);
                    return { ok: false };
                });

            timeoutHandle.clear();

            if (response.ok) {
                console.log(`${operation} successful with endpoint: ${endpoint.path}`);
                return true;
            } else if (response.status) {
                console.log(`${operation} failed with endpoint ${endpoint.path}: HTTP ${response.status}`);
            } else {
                console.log(`${operation} failed with endpoint ${endpoint.path}: Network error`);
            }
        } catch (error) {
            console.log(`Error trying ${endpoint.path} for ${operation}: ${error.message || 'Unknown error'}`);
        }
    }

    return false;
}

/**
 * Wait for a model to be loaded (with timeout)
 * @param {string} ip - Server IP
 * @param {string} port - Server port
 * @param {string} modelId - Model ID to check
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {Promise<boolean>} - True if model is loaded
 */
async function waitForModelLoad(ip, port, modelId, maxAttempts = 10) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            console.log(`Checking if model is loaded (attempt ${attempt + 1}/${maxAttempts})...`);

            // Make a simple test completion to see if the model responds
            const authHeaders = await getAuthHeaders(); // await here
            console.log(`Auth headers for model verification:`, Object.keys(authHeaders));
            
            const testResponse = await fetch(getServerUrl('/v1/chat/completions'), {
                method: 'POST',
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: 'test' }
                    ],
                    max_tokens: 1,
                    stream: false
                }),
                timeout: 2000
            });

            if (testResponse.ok) {
                            // Read the completed text - this confirms the model is actually loaded
            const response = await testResponse.json();
            console.log(`Model ${modelId} is now loaded and responding:`, response);

            // Store the current loaded model in a global variable for easy access
            window.currentLoadedModel = modelId;

            return true;
            }
        } catch (error) {
            console.log(`Model not loaded yet, waiting...`, error);
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.error(`Model ${modelId} failed to load after ${maxAttempts} attempts`);
    return false;
}

/**
 * Force load a model in LM Studio
 * This bypasses the API endpoints and uses the completion API itself
 * @param {string} ip - Server IP
 * @param {string} port - Server port
 * @param {string} modelId - Model ID to load
 * @returns {Promise<boolean>} - True if successful
 */
async function forceLoadModel(ip, port, modelId) {
    try {
        console.log(`Force loading model ${modelId} via completion API...`);

        const authHeaders = await getAuthHeaders(); // await here

        const response = await fetch(getServerUrl('/v1/chat/completions'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant. Please respond with a single word: "LOADED" to indicate you are working properly.'
                    },
                    {
                        role: 'user',
                        content: 'Please respond with exactly one word: "LOADED". This is to verify you are working correctly.'
                    }
                ],
                temperature: 0.1,
                max_tokens: 10,
                stream: false
            }),
            timeout: 60000 // Long timeout to give the model time to load
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`Force load response:`, result);
            return true;
        } else {
            console.error(`Force load failed with status ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error(`Error during force load:`, error);
        return false;
    }
}

/**
 * Loads a model in LM Studio
 * @param {string} modelId - The ID of the model to load
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function loadModel(modelId) {
    try {
        if (!serverIpInput || !serverPortInput) {
            console.error('Server IP or port input elements not found');
            return false;
        }

        const ip = serverIpInput.value.trim();
        const port = serverPortInput.value.trim();

        if (!ip || !port) {
            console.error('Server IP or port is empty');
            return false;
        }

        console.log(`Attempting to load model: ${modelId}`);

        // Try the direct model loading approach first
        // Some LM Studio versions have direct APIs
        const loadEndpoints = [
            { path: '/v1/internal/model/load', method: 'POST' },
            { path: '/v1/model/load', method: 'POST' },
            { path: '/v1/models/load', method: 'POST' },
            { path: `/v1/models/${modelId}/load`, method: 'POST' }
        ];

        const requestData = { model_id: modelId };
        const directSuccess = await tryEndpoints(ip, port, 'Load model', loadEndpoints, requestData);

        // If the endpoint call succeeds, verify the model is actually loaded by making a test request
        if (directSuccess) {
            console.log(`API endpoint reported success, verifying model is actually loaded...`);
            const verified = await waitForModelLoad(ip, port, modelId, 5);

            if (verified) {
                console.log(`Successfully verified ${modelId} is loaded via endpoint method`);
                await fetchAvailableModels();
                return true;
            } else {
                console.log(`API endpoint succeeded but model is not actually loaded, trying force load...`);
            }
        }

        // If direct loading failed or verification failed, use the force load method
        // This is the most reliable method to make LM Studio actually switch models
        const forceSuccess = await forceLoadModel(ip, port, modelId);

        if (forceSuccess) {
            console.log(`Successfully loaded ${modelId} via force load method`);
            await fetchAvailableModels();
            return true;
        }

        console.error(`All methods failed to load model ${modelId}`);
        return false;
    } catch (error) {
        console.error('Error loading model:', error);
        return false;
    }
}

/**
 * Ejects (unloads) the current model from LM Studio
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function ejectModel() {
    try {
        if (!serverIpInput || !serverPortInput) {
            console.error('Server IP or port input elements not found');
            return false;
        }

        const ip = serverIpInput.value.trim();
        const port = serverPortInput.value.trim();

        if (!ip || !port) {
            console.error('Server IP or port is empty');
            return false;
        }

        console.log('Attempting to eject model');

        // Try all known eject model endpoints
        const ejectEndpoints = [
            { path: '/v1/internal/model/unload', method: 'POST' },
            { path: '/v1/model/unload', method: 'POST' },
            { path: '/v1/models/unload', method: 'POST' }
        ];

        // Try the endpoints with an empty request body
        let success = await tryEndpoints(ip, port, 'Eject model', ejectEndpoints, {});

        // If direct API methods fail, try to determine the currently loaded model ID
        // and use a different approach
        if (!success) {
            console.log('Standard eject endpoints failed, trying to identify current model...');

            try {
                // Get the current models list to find which one is loaded
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                // Await auth headers here
                const modelsAuthHeaders = await getAuthHeaders();

                const modelsResponse = await fetch(getServerUrl('/v1/models'), {
                    signal: controller.signal,
                    headers: modelsAuthHeaders
                }).catch(() => {
                    return { ok: false };
                });

                clearTimeout(timeoutId);

                if (modelsResponse.ok) {
                    const data = await modelsResponse.json();
                    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
                        // Try to find which model is loaded
                        const loadedModel = data.data.find(model =>
                            model.ready === true ||
                            model.loaded === true ||
                            model.status === 'loaded' ||
                            model.status === 'ready' ||
                            model.state === 'loaded' ||
                            model.state === 'ready'
                        );

                        if (loadedModel) {
                            console.log(`Found loaded model: ${loadedModel.id}, trying model-specific eject...`);

                            // Try model-specific unload endpoints
                            const modelSpecificEndpoints = [
                                { path: `/v1/models/${loadedModel.id}/unload`, method: 'POST' }
                            ];

                            success = await tryEndpoints(ip, port, 'Model-specific eject', modelSpecificEndpoints, {});
                        } else {
                            console.log('No loaded model found in models list');
                        }
                    } else {
                        console.log('Invalid or empty models response:', data);
                    }
                } else {
                    console.log('Failed to fetch models for model-specific ejection');
                }
            } catch (modelCheckError) {
                console.log('Error checking for loaded model:', modelCheckError.message || 'Unknown error');
            }
        }

        if (success) {
            console.log('Successfully ejected model');
            // Clear the available models list and hide the model display
            availableModels = [];
            // This is where we SHOULD clear the global variable as the model is actually being ejected
            window.currentLoadedModel = null;

            // Since we're actually ejecting the model, we need to update the UI
            // Call hideLoadedModelDisplay but prevent it from clearing currentLoadedModel again
            if (loadedModelDisplay) {
                loadedModelDisplay.classList.add('hidden');
                loadedModelDisplay.dataset.hasLoadedModel = 'false';
            }

            // Verify the model was actually ejected
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetchAvailableModels();

            return true;
        } else {
            console.log('All eject endpoints failed - the model may still be loaded');

            // Force a refresh of the models list to update the UI regardless
            await fetchAvailableModels();

            return false;
        }
    } catch (error) {
        console.log('Error in ejectModel:', error.message || 'Unknown error');

        // Try to refresh the models list to at least update the UI
        try {
            await fetchAvailableModels();
        } catch (refreshError) {
            console.log('Failed to refresh models after eject error');
        }

        return false;
    }
}

/**
 * Gets the API URL
 * @returns {string} - The current API URL
 */
export function getApiUrl() {
    if (!API_URL && serverIpInput && serverPortInput) {
        const ip = serverIpInput.value.trim();
        const port = serverPortInput.value.trim();

        if (ip && port) {
            API_URL = getServerUrl('/v1/chat/completions');
            console.log('API URL was not set, creating from inputs:', API_URL);
        }
    }

    return API_URL;
}

/**
 * Gets the available models
 * @returns {Array} - Array of available model IDs
 */
export function getAvailableModels() {
    // Since availableModels contains string IDs, not objects, just return the array directly
    return [...availableModels]; // Return a copy of the array
}

/**
 * Loads saved server settings from localStorage
 */
export async function loadServerSettings() {
    const savedIp = localStorage.getItem('serverIp');
    const savedPort = localStorage.getItem('serverPort');
    const savedSSL = localStorage.getItem('serverSSL') === 'true';
    const savedUseAuth = localStorage.getItem('use-auth') === 'true';
    
    // Add these to avoid ReferenceError later
    let savedAuthUsername = null;
    let savedAuthPassword = null;
    
    console.log('Loading server settings, auth enabled:', savedUseAuth);

    if (serverIpInput && serverPortInput) {
        if (savedIp) serverIpInput.value = savedIp;
        if (savedPort) serverPortInput.value = savedPort;
        
        // Restore SSL setting
        const sslSwitch = document.getElementById('server-ssl-switch');
        if (sslSwitch) sslSwitch.checked = savedSSL;
        
        // Restore authentication settings
        const useAuthSwitch = document.getElementById('use-auth-switch');
        const authUsername = document.getElementById('auth-username');
        const authPassword = document.getElementById('auth-password');
        const authFields = document.getElementById('auth-fields');
        
        if (useAuthSwitch && authUsername && authPassword && authFields) {
            useAuthSwitch.checked = savedUseAuth;
            authFields.classList.toggle('hidden', !savedUseAuth);
            
            if (savedUseAuth) {
                // Get credentials from secure storage
                const credentials = await getSecureCredentials();
                if (credentials.username) {
                    authUsername.value = credentials.username;
                    savedAuthUsername = credentials.username; // store for hasValidAuth check
                }
                if (credentials.password) {
                    authPassword.value = credentials.password;
                    savedAuthPassword = credentials.password; // store for hasValidAuth check
                    console.log('Restored password from secure storage');
                }
            }
            
            // Make sure the authentication settings are properly saved
            if (savedUseAuth) {
                localStorage.setItem('use-auth', 'true');
                
                // Make sure the auth elements have the correct values before we try to use them
                const testAuthHeaders = await getAuthHeaders();
                console.log('Test auth headers after loading settings:', 
                    Object.keys(testAuthHeaders).includes('Authorization') ? 'Auth header present' : 'No auth header');
            }
        }

        if (savedIp && savedPort) {
            API_URL = getServerUrl('/v1/chat/completions');
            
            // Only fetch models automatically if authentication is NOT required
            // or if we already have authentication credentials
            const hasValidAuth = savedUseAuth && savedAuthUsername && savedAuthPassword;
            window.isInitialStartup = true;
            
            if (!savedUseAuth || hasValidAuth) {
                // Only fetch models if no authentication is needed or we have credentials
                console.log("Auto-fetching models with existing credentials");
                setTimeout(() => fetchAvailableModels(), 500);
            } else {
                console.log("Authentication required but no credentials saved, skipping auto-fetch of models");
                // Don't fetch models until the user has entered credentials
            }
            
            // Reset the flag after a delay to allow for normal operation later
            setTimeout(() => {
                window.isInitialStartup = false;
            }, 2000);
        }

        // Add event listeners for IP and port inputs
        serverIpInput.addEventListener('change', updateServerUrl);
        serverPortInput.addEventListener('change', updateServerUrl);

        // Apply to both input fields
        [serverIpInput, serverPortInput].forEach(input => {
            // Remove any inline styles to allow CSS variables to work
            input.style.removeProperty('background-color');
            input.style.removeProperty('color');

            // Add classes to ensure proper styling
            input.classList.add('theme-aware-input');
        });
    }
}
