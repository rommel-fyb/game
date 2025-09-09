# Game Iframe Player

A simple Angular web application that allows you to load and play any web-based game in an iframe.

## Features

- 🎮 Load any game by entering its URL
- 🚀 Quick access to popular preset games
- 🔒 Secure URL sanitization
- 📱 Responsive design
- ⚡ Fast loading with loading indicators

## Preset Games

The app comes with several preset games that are known to work well in iframes:

- **Chess** - Classic strategy game
- **2048** - Number puzzle game
- **Snake Game** - Classic arcade game
- **Tetris** - Block puzzle game
- **Minesweeper** - Logic puzzle game
- **Othello** - Strategy board game

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:4200`

### Building for Production

To build the app for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. **Using Preset Games**: Click on any of the preset game buttons to instantly load that game.

2. **Loading Custom Games**: 
   - Enter a game URL in the input field
   - Click "Load Game" or press Enter
   - The game will load in the iframe below

3. **Clearing Games**: Click the "Clear" button to remove the current game.

## Supported Game URLs

The app works with most web-based games that:
- Allow iframe embedding (no X-Frame-Options restrictions)
- Use HTTPS (required for security)
- Are accessible without authentication

## Technical Details

- Built with Angular 17
- Uses Angular's DomSanitizer for secure URL handling
- Responsive design with CSS Grid and Flexbox
- TypeScript for type safety

## Troubleshooting

- **Game won't load**: The game URL might not allow iframe embedding or might require authentication
- **Security errors**: Make sure the URL uses HTTPS
- **Loading issues**: Check your internet connection and try refreshing the page

## License

This project is open source and available under the MIT License.
