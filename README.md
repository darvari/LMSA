# LMSA - LM Studio Android 
![Status: Open Source](https://img.shields.io/badge/Status-Open%20Source-brightgreen)
![Version: Current](https://img.shields.io/badge/Version-Current-green)
![Release: Community](https://img.shields.io/badge/Release-Community%20Driven-blue)

<p align="left">
  <a href="https://play.google.com/store/apps/details?id=com.lmsa.app">
    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" height="80">
  </a>
  <a href="https://github.com/techcow2/LMSA/releases">
    <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Get it on GitHub" height="80">
  </a>
</p>

## 🆕 What's New
🎉 **Latest Update: Version 7.1** - August 2025

### New Features & Improvements
- **Settings Menu Fix**: Fixed an issue where the settings menu wasn't positioning itself correctly on some devices, ensuring consistent user experience across all device types
- **Performance Optimization**: The app has been fully optimized to run better on more devices with improved performance, reduced memory usage, and enhanced stability across different hardware configurations
- **System Prompts Feature**: The character feature has been replaced with the ability to save system prompts, providing a more flexible and powerful way to customize your AI interactions. You can now create, save, and manage multiple system prompts for different use cases
- **Enhanced Compatibility**: Improved device compatibility and performance optimizations for a smoother experience across various Android devices

### Bug Fixes
- **CORS & Preflight Redirects:** Fixed persistent CORS errors by ensuring all requests use the correct protocol and port logic.
- **Android Build Parity:** Synced all Capacitor/Android build JS files with main codebase changes.

## 🔀 Changes in This Fork

This fork includes significant improvements to enable secure remote access to LM Studio servers:

### Server Connection Enhancements
- **Smart URL Construction**: Completely refactored API calls to use a centralized `getServerUrl()` function, ensuring consistent protocol and port handling across all requests
- **Domain Name Support**: Added support for domain names in addition to IP addresses
- **Automatic Protocol Detection**: The app now detects if a URL includes protocols (http/https) and adjusts settings accordingly
- **Authentication Support**: Added optional username/password authentication for secure remote access to LM Studio servers
  - Can be toggled on/off for both remote and local connections
  - Credentials are stored securely in localStorage
  - Multiple account support with different servers
- **Smart Port Handling**: 
  - Ports are omitted for standard protocols (port 80 for HTTP, port 443 for HTTPS) to prevent browser redirect issues
  - Default port 443 is automatically used when SSL is enabled
  - Default port 1234 is used for non-SSL connections if no port is specified
- **Enhanced Security**: Non-local domains (anything not matching localhost/127.0.0.1/10.x.x.x/192.168.x.x/172.16-31.x.x) automatically use HTTPS for improved security
- **Server Response Testing**: Added a Test Server Response button to verify connectivity and display server status before attempting to chat

### Mobile UI Improvements
- **Field Validation**: Domain name input field has autocorrect and spellcheck disabled for more accurate entry
- **Visual Feedback**: Port field shows default values in grey when not explicitly set
- **Error Handling**: Improved error messages for connection issues, specifically addressing CORS and preflight redirect problems

### Previous Updates
- **Version 7.0**: Performance optimization, system prompts feature, and enhanced compatibility
- **Version 6.5**: Added scroll to bottom icon, improved welcome screen behavior, and comprehensive performance improvements
- **Version 5.5**: Added full Vision Language Model (VLM) support for image upload and analysis, enabling multimodal conversations with AI models
- **Bug Fixes**: Resolved keyboard overlap issues, fixed PDF file attachments, and disabled auto-scroll feature for better chat experience

---

## 📸 Screenshots
<p align="left">
  <img src="https://github.com/user-attachments/assets/ba437aee-6bc4-4442-948b-777cb34adea8" width="150" style="display:inline-block" />
  <img src="https://github.com/user-attachments/assets/67f86d21-dccb-4f1c-b4c9-ebe22551cac3" width="150" style="display:inline-block" />
  <img src="https://github.com/user-attachments/assets/673fad48-bd93-42df-91e2-8a7927002c86" width="150" style="display:inline-block" />
  <img src="https://github.com/user-attachments/assets/0eec29a7-35d2-474a-af63-ba05522adac8" width="150" style="display:inline-block" />
</p>

## 📋 What is LMSA?
LMSA (LM Studio Assistant) is an Android front-end application for LM Studio that provides a clean, user-friendly interface to interact with language models on your Android device. It's designed with privacy in mind, offering a tracking-free experience for users who want to leverage the power of large language models on mobile.

### Key Functionality:
- Connect to LM Studio running on your computer
- Chat with AI models through a mobile-optimized interface
- Upload and analyze documents using AI
- Upload and analyze images with vision language models
- Customize AI behavior with system prompts and temperature settings

## 🔓 Project Status
This project has transitioned to **open source** development.

### Development Information
The project is now community-driven and open source. Development efforts are focused on collaborative community contributions, with regular updates and improvements available through GitHub releases.

## 🌟 Features Overview

### Privacy & Security
- **Community updates** improving app security and stability
- **Privacy-focused design** with no unnecessary tracking
- **Secure connections** to your LM Studio instance
- **Privacy First** - Your conversations never leave your personal network as models run locally

### AI Capabilities
- **Document analysis** - Chat with your files
- **Image analysis** - Upload and discuss images with vision language models
- **Multimodal interactions** - Combine text, documents, and images in conversations
- **Custom instructions** - Personalize AI responses
- **Precision tuning** - Adjust response creativity and accuracy  
- **System prompt** - Set context for more relevant responses
- **AI Reasoning Visibility** - Toggle the ability to see the model's "thinking" process before generating responses
- **File Processing** - Upload and process files to include in your prompts for more context-aware responses

### User Experience
- **Clean interface** - Intuitive design for effortless interaction
- **Model information** - View details about the loaded AI model
- **Tablet optimization** - Enhanced layout for larger screens
- **Sidebar navigation** - Quick access to conversations and settings
- **Dark Mode Support** - Chat comfortably day or night with full UI theme support
- **Mobile-Responsive Design** - Optimized for both phones and tablets of various screen sizes
- **Quick Navigation** - "Scroll to Bottom" button for faster movement in long chats

### Conversation Management
- **Multiple Conversations** - Create and manage separate chat threads for different topics
- **Comprehensive History** - Save, browse, and continue previous conversations with organized chat management
- **Automatic Titles** - Saved chats are automatically titled for easy identification
- **Import/Export** - Easily backup and transfer your saved conversations between devices
- **Response Management** - Copy, regenerate, or modify AI responses with ease

### Connection & Configuration
- **Simple Connection** - Connect to your LM Studio server with just an IP address and port
- **Advanced Customization** - Adjust temperature, system prompts, and other model parameters directly from your phone
- **Secure Authentication** - Optional username/password authentication for remote server access
- **Multiple Account Support** - Save different credentials for different server connections

## 💻 How It Works
1. Start LM Studio on your computer and load your favorite language model (including vision language models)
2. Activate the server feature in LM Studio (usually on port 1234)
3. Connect the Android app to your computer using your local network
4. Start chatting with your AI models from anywhere in your home

LMSA connects to LM Studio running on your computer, allowing you to:
- Access powerful AI language models from your mobile device
- Chat with AI models using a simple, intuitive interface
- Upload documents for the AI to analyze and discuss
- Upload images for vision language models to analyze and discuss
- Customize AI behavior through temperature and system prompt settings

## 👥 Perfect For
- AI enthusiasts who want to access their models on the go
- Privacy-conscious users who prefer keeping their data local
- Developers testing different prompts and model responses
- Researchers who need to include file content in their AI interactions
- Visual content creators who want to analyze and discuss images with AI
- Anyone who wants the convenience of mobile access to powerful AI

## 🔧 Technical Requirements
- Android 5.0 or higher
- LM Studio installed and running on a computer with a suitable language model (text or vision)
- Both devices connected to the same network

## 🚀 Get Started Today
1. Download and install the app
2. Start LM Studio and load a model on your computer
3. Start the LM Studio server
4. Open the app and enter the server IP and port in Settings
5. Begin chatting immediately!

## Installation
---

## 🛠️ Building the APK & Setting Up Nginx on Ubuntu

## 🛠️ Building the LMSA APK on Ubuntu
---

## 🖥️ Running LMSA Locally in Your Browser

You can run LMSA as a web app for local testing and development:

### Prerequisites
- Node.js and npm installed

### Steps
1. Open a terminal in the LMSA project directory.
2. Install a simple static server (if you don't have it):
  ```bash
  npm install -g serve
  ```
3. Start the server:
  ```bash
  npx serve .
  ```
4. Open your browser and go to:
  ```
  http://localhost:3000/index.html
  ```

You can now use LMSA directly in your browser. Make sure your LM Studio server is running and configured for local access.

---

### Prerequisites

Install Capacitor and Android build tools:
```bash
sudo apt update
sudo apt install nodejs npm openjdk-11-jdk android-sdk adb
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Building the APK

1. Clone the repository:
  ```bash
  git clone https://github.com/peterrhone/LMSA.git
  cd LMSA
  ```
2. Create or update the Capacitor project:
  ```bash
  npm init -y
  npx cap init LMSA com.example.lmsa --web-dir www
  mkdir -p www
  cp -r index.html css js icon.png www/
  ```
3. Add the Android platform:
2. Create or update the Capacitor project:
  ```bash
  npm init -y
  npx cap init LMSA com.example.lmsa --web-dir www
  mkdir -p www
  cp -r index.html css js icon.png www/
  ```
3. Add the Android platform:
  ```bash
  npx cap add android
  # For Android 8 compatibility:
  # Edit android/variables.gradle to set minSdkVersion = 26
  # Edit capacitor.config.json to add Android configuration
  npx cap sync
  ```
4. Open in Android Studio and build:
  ```bash
  npx cap open android
  ```
5. In Android Studio:
   - Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
   - Find the APK in `android/app/build/outputs/apk/debug/app-debug.apk`

6. Install the APK on your device:
  ```bash
  adb install ./android/app/build/outputs/apk/debug/app-debug.apk
  ```

### Notes
- Make sure you have Android Studio installed and configured.
- You may need to set up your device for USB debugging.

---
1. Clone the repository
2. npm install @capacitor/core @capacitor/cli @capacitor/android
3. npx cap init LMSA com.example.lmsa --web-dir www
4. Copy web files to www directory (cp -r index.html css js icon.png www/)
5. npx cap add android
6. npx cap sync
7. npx cap open android
8. Build the APK in Android Studio
9. Install the resulting APK from ./android/app/build/outputs/apk/debug/app-debug.apk to your phone with adb install

## 📥 Download Information
---

## 🌐 Remote Access & Nginx Configuration

To enable secure remote access with HTTPS and Basic Authentication while resolving CORS issues, follow these steps:

### Setting Up Nginx with SSL and Basic Authentication

1. **Install Nginx and the headers-more module**:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nginx apache2-utils
   sudo apt install libnginx-mod-http-headers-more-filter  # Headers-more module
   
   # For CentOS/RHEL, use EPEL repository
   sudo yum install nginx nginx-mod-http-more
   sudo yum install httpd-tools  # For htpasswd utility
   ```

2. **Create a password file for authentication**:
   ```bash
   # Create a new password file (replace 'username' with your desired username)
   sudo htpasswd -c /etc/nginx/.htpasswd username
   
   # Add additional users (omit -c flag)
   sudo htpasswd /etc/nginx/.htpasswd another_user
   ```

3. **Create SSL certificates** (or use Let's Encrypt):
   ```bash
   # Self-signed certificate for testing
   sudo mkdir -p /etc/nginx/ssl
   sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout /etc/nginx/ssl/your.domain.com.key \
     -out /etc/nginx/ssl/your.domain.com.crt
   ```

4. **Configure Nginx**:
   Create a configuration file at `/etc/nginx/sites-available/lmstudio` with the following content:

```nginx
server {
  listen 443 ssl;
  server_name your.domain.com;  # Replace with your actual domain

  ssl_certificate /etc/nginx/ssl/your.domain.com.crt;
  ssl_certificate_key /etc/nginx/ssl/your.domain.com.key;
  
  # Strong SSL settings
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
  
  # Basic Authentication
  auth_basic "Restricted Access";
  auth_basic_user_file /etc/nginx/.htpasswd;

  location / {
    proxy_pass http://localhost:1234;  # LM Studio server port
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # Robust CORS headers for all requests
    more_set_headers 'Access-Control-Allow-Origin: *';
    more_set_headers 'Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE';
    more_set_headers 'Access-Control-Allow-Headers: Authorization,Content-Type,Origin,Accept';
    more_set_headers 'Access-Control-Allow-Credentials: true';

    # Handle preflight OPTIONS requests
    if ($request_method = 'OPTIONS') {
      more_set_headers 'Access-Control-Max-Age: 1728000';
      more_set_headers 'Content-Type: text/plain charset=UTF-8';
      more_set_headers 'Content-Length: 0';
      return 204;
    }
  }
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name your.domain.com;
  return 301 https://$server_name$request_uri;
}
```

5. **Enable the site and restart Nginx**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/lmstudio /etc/nginx/sites-enabled/
   sudo nginx -t  # Test the configuration
   sudo systemctl restart nginx
   ```

6. **Configure firewall** (if applicable):
   ```bash
   sudo ufw allow 'Nginx Full'
   ```

### Connecting LMSA to Your Secure Server

1. Open the LMSA app
2. Go to Settings
3. Enter your domain name (e.g., `your.domain.com`)
4. Enable SSL/HTTPS toggle
5. Enter username and password in the authentication section
6. Test the connection

### Security Notes

- Using Basic Authentication with HTTPS ensures your credentials are encrypted in transit
- The CORS headers allow the mobile app to communicate with your server
- For production use, consider obtaining a proper SSL certificate from Let's Encrypt
- Regularly update your passwords for better security
- The headers-more module is required for proper CORS header handling

---

### Recommended: Google Play Release
**LMSA - Google Play**<br>
**Publisher:** IslandApps<br>
**Updates:** Regular feature, security and maintenance updates<br>
[**Download Now →**](https://play.google.com/store/apps/details?id=com.lmsa.app)

## ⚠️ Disclaimer
LMSA is a third-party application and is not affiliated with LM Studio or its developers. This app is independently developed to provide an Android front-end interface for interacting with LM Studio. Use of this app is at your own discretion, and the developers of LMSA are not responsible for any issues arising from its use.

---

© 2025 IslandApps. All rights reserved. Google Play is a trademark of Google LLC.
