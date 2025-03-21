# AI Background Remover

A React application that uses Google Cloud Vision API to remove backgrounds from images.

## Features

- Image upload (drag-and-drop and file selection)
- Background removal using Google Cloud Vision API
- Real-time processing status
- Download processed images
- Minimalist design

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Google Cloud credentials:
   ```
   REACT_APP_GOOGLE_CLOUD_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/        # React components
├── services/         # API and utility services
├── styles/          # CSS modules and global styles
└── hooks/           # Custom React hooks
```

## Technical Stack

- React (Create React App)
- Google Cloud Vision API
- CSS Modules for styling
- Axios for API requests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
