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

## 🆕 What's New in Upstream
🎉 **Latest Update: Version 7.1** - August 2025

- **Settings Menu Fix**: Fixed an issue where the settings menu wasn't positioning itself correctly on some devices
- **Performance Optimization**: Improved performance, reduced memory usage, and enhanced stability across different hardware configurations
- **System Prompts Feature**: Replaced character feature with the ability to save system prompts for more flexible AI interactions
- **Enhanced Compatibility**: Improved device compatibility for a smoother experience across various Android devices

## 🔀 About This Fork

This fork adds secure remote access LMSA, giving you the ability utilize LM Studio on your server from anywhere.

### Server Connection Changes
- **Domain Name Support**: Added support for domain names in addition to IP addresses
- **Automatic Protocol Detection**: Detects if URLs include protocols (http/https)
- **Server Response Testing**: Added Test Server Response button to verify connectivity
- **Smart URL Construction**: Centralized `getServerUrl()` function for consistent protocol and port handling
- **Authentication Support**: Optional username/password authentication for secure remote access
  - Toggle on/off for both remote and local connections
  - Secure credential storage in localStorage
  - Multiple account support for different servers
- **Smart Port Handling**: 
  - Standard ports omitted (80 for HTTP, 443 for HTTPS) to prevent redirect issues
  - Default port 443 used with SSL enabled
  - Default port 1234 used for non-SSL connections when unspecified
- **Enhanced Security**: Non-local domains automatically use HTTPS

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
3. Connect the Android app to your computer
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

## 🚀 Getting Started

### Run Locally in Your Browser

You can run LMSA as a web app for local testing and development:

#### Prerequisites
- Node.js v16+ and npm v8+

#### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/peterrhone/LMSA.git
   cd LMSA
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start a local server:
   ```bash
   npx serve .
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000/index.html
   ```

## 🛠️ Building the LMSA APK from Source

### Prerequisites
- Ubuntu 20.04 LTS or newer (or similar Linux distribution)
- Node.js v16+ and npm v8+
- JDK 11+
- Android SDK 30+ (via Android Studio)
- Git

### Step 1: Install Required Dependencies
```bash
# Install Node.js and npm if not installed
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt update
sudo apt install -y nodejs openjdk-11-jdk git

# Verify installations
node --version  # Should be v16.x or higher
npm --version   # Should be v8.x or higher
java --version  # Should be v11.x or higher
```

### Step 2: Install Android Studio and Android SDK
1. Download and install Android Studio from [developer.android.com](https://developer.android.com/studio)
2. During installation, ensure "Android SDK" and "Android SDK Platform-Tools" are selected
3. After installation, open Android Studio and go to "SDK Manager"
4. Install Android SDK Platform 30 (or higher) and Android Build Tools 30.0.3 (or higher)

### Step 3: Set Up Environment Variables
Add the following to your `~/.bashrc` file:

```bash
# Android SDK paths
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
export CAPACITOR_ANDROID_STUDIO_PATH=/path/to/android-studio/bin/studio # set path accordingly
```

Reload your bash profile:
```bash
source ~/.bashrc
```

### Step 4: Clone and Build the Project
```bash
# Clone the repository
git clone https://github.com/peterrhone/LMSA.git
cd LMSA

# Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# Initialize Capacitor project
npm init -y
npx cap init LMSA com.example.lmsa --web-dir www

# Prepare web files
mkdir -p www
cp -r index.html css js assets icon.png www/

# Add Android platform
npx cap add android

# Configure for Android 8+ compatibility (SDK 26+)
# Edit android/variables.gradle to set minSdkVersion = 26

# Sync project
npx cap sync
```

### Step 5: Configure Credential Storage
To enable secure credential storage for authentication:

1. Install the Secure Storage Cordova plugin:
   ```bash
   npm install cordova-plugin-secure-storage-echo
   npx cap sync
   ```

2. The app uses this plugin to securely store authentication credentials.

3. The necessary permissions are automatically added to AndroidManifest.xml when you run `npx cap sync`:
   - INTERNET permission for network connectivity
   - Optional biometric permissions for secure storage access (if available on device)

   You don't need to manually edit the AndroidManifest.xml file as Capacitor handles this automatically.

### Step 6: Build and Run the APK
```bash
# Open the project in Android Studio
npx cap open android

# In Android Studio:
# 1. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
# 2. Find the APK in android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 7: Install the APK on Your Device
Connect your Android device via USB (with USB debugging enabled) and run:
```bash
adb install ./android/app/build/outputs/apk/debug/app-debug.apk
```

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
3. Enter your domain name (e.g., `https://your.domain.com`)
4. Enter username and password in the authentication section
5. Test the connection

### Security Notes

- Using Basic Authentication with HTTPS ensures your credentials are encrypted in transit
- The CORS headers allow the mobile app to communicate with your server
- For production use, consider obtaining a proper SSL certificate from Let's Encrypt
- Regularly update your passwords for better security
- The headers-more module is required for proper CORS header handling

## 📥 Download Options

### GitHub Release
This fork is not available on Google Play.  

## ⚠️ Disclaimer
LMSA is a third-party application and is not affiliated with LM Studio or its developers. This app is independently developed to provide an Android front-end interface for interacting with LM Studio. Use of this app is at your own discretion, and the developers of LMSA are not responsible for any issues arising from its use.

---

© 2025 IslandApps. All rights reserved. Google Play is a trademark of Google LLC.