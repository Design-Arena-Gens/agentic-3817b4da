# YouTube Auto Uploader

A Next.js application that allows you to automatically upload videos to YouTube using the YouTube Data API v3.

## Features

- OAuth 2.0 authentication with YouTube
- Simple web interface for video uploads
- Video title and description customization
- Secure credential management

## Setup Instructions

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one

2. **Enable YouTube Data API v3**
   - In your Google Cloud Project, go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Desktop app" as the application type
   - Download the credentials JSON file
   - Save it as `credentials.json` in the project root directory

4. **Configure OAuth Consent Screen**
   - Add your email as a test user
   - Add the scope: `https://www.googleapis.com/auth/youtube.upload`

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Run the Development Server**
   ```bash
   npm run dev
   ```

7. **Authenticate**
   - Open http://localhost:3000
   - Click "Authenticate with YouTube"
   - Complete the OAuth flow in the popup window

8. **Upload Videos**
   - Select a video file
   - Enter title and description
   - Click "Upload to YouTube"

## Deployment

This app can be deployed to Vercel:

```bash
vercel deploy --prod
```

Note: For production deployment, you'll need to handle credentials securely using environment variables.

## Privacy

Videos are uploaded as "private" by default. You can change this in the code by modifying the `privacyStatus` field in `app/api/upload/route.ts`.

## License

MIT
