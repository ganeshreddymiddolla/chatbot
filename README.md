
# Sradex AI Assistant

This is a world-class, voice-enabled AI assistant built with React, TypeScript, and the Google Gemini API. It features a simulated voice cloning process and a real-time voice conversation mode.

## Features

- **Simulated Voice Cloning:** An immersive onboarding experience that simulates analyzing the user's voice to create a personalized AI voice profile.
- **Live Conversation Mode:** A full-screen, voice-activated chat mode with a dynamic voice visualizer.
- **Streaming Responses:** AI answers are streamed token-by-token for a "live writing" effect, similar to ChatGPT.
- **Google Search Integration:** The AI uses Google Search grounding to provide up-to-date and accurate information.
- **Professional UI/UX:** A stunning, attractive, and user-friendly interface built with Tailwind CSS and Framer Motion for smooth animations.
- **Centralized State Management:** Robust and error-free microphone handling through centralized hooks.

## Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- A Google Gemini API Key

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd sradex-ai-assistant
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your API Key:**
    Create a `.env` file in the root of the project and add your Google Gemini API key:
    ```
    VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

4.  **Update API Key Access in Code:**
    For Vite to expose the environment variable, you must access it with `import.meta.env.VITE_GEMINI_API_KEY`. The current code uses `process.env.API_KEY`. You will need to update `hooks/useChat.ts` accordingly:

    Change this line:
    `const API_KEY = process.env.API_KEY;`
    
    To this:
    `const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;`

## Running the Development Server

To run the application locally with hot-reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

To create a production-ready build of the application:

```bash
npm run build
```

This command will:
1.  Run the TypeScript compiler (`tsc`) to check for type errors.
2.  Run `vite build` to bundle the application into static HTML, CSS, and JavaScript files.

The output will be placed in a `dist/` directory.

## Deploying the Application

The contents of the `dist/` directory are ready to be deployed to any static hosting service.

### Example: Deploying to Vercel or Netlify

1.  Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  Connect your repository to your Vercel or Netlify account.
3.  Configure the build settings:
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `dist`
4.  **Add Environment Variable:**
    In your hosting platform's project settings, add an environment variable named `VITE_GEMINI_API_KEY` with your Google Gemini API key as the value.
5.  Deploy!

The platform will automatically build and deploy your application.
