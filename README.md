# CubeRush

A minimal, real-time Rubik's Cube solving speed tracker inspired by MonkeyType. Track your cube-solving speed with AI-powered detection and compete with others on the global leaderboard.

## Features

- Real-time cube solving detection using TensorFlow.js and HandPose
- Automatic time tracking and move counting
- Global leaderboard
- User authentication and solve history
- Beautiful, minimal design inspired by MonkeyType
- Mobile and desktop responsive

## Tech Stack

- React.js + TypeScript
- TailwindCSS for styling
- Firebase (Auth + Firestore)
- TensorFlow.js for hand & cube detection
- Framer Motion for animations

## Prerequisites

1. Node.js 16+ and npm
2. A Firebase project with Authentication and Firestore enabled
3. A webcam

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cuberush.git
   cd cuberush
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## Usage

1. Open CubeRush in your browser
2. Allow camera access when prompted
3. Position your Rubik's Cube in front of the camera
4. Click "Start Solving" to begin
5. Solve the cube!
6. Your time and stats will be automatically recorded
7. Login to save your solves and compete on the leaderboard

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── hooks/         # Custom React hooks
  ├── services/      # Firebase and other services
  ├── utils/         # Utility functions
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT 