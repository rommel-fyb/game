import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  gameUrl: string = '';
  currentGameUrl: SafeResourceUrl | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Preset game URLs - tested and working
  presetGames = [
    { name: 'Chess', url: 'https://playpager.com/embed/chess/index.html' },
    { name: '2048', url: 'https://play2048.co/' },
    { name: 'Snake Game', url: 'https://snake-game.io/' },
    { name: 'Tetris', url: 'https://tetris.com/play-tetris' },
    { name: 'Minesweeper', url: 'https://minesweeper.online/' },
    { name: 'Othello', url: 'https://playpager.com/embed/othello/index.html' }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  loadGame() {
    if (!this.gameUrl.trim()) {
      this.errorMessage = 'Please enter a game URL';
      return;
    }

    // Basic URL validation
    try {
      new URL(this.gameUrl);
    } catch {
      this.errorMessage = 'Please enter a valid URL (include http:// or https://)';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate loading time
    setTimeout(() => {
      this.currentGameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.gameUrl);
      this.isLoading = false;
    }, 500);
  }

  loadPresetGame(url: string) {
    this.gameUrl = url;
    this.loadGame();
  }

  clearGame() {
    this.currentGameUrl = null;
    this.gameUrl = '';
    this.errorMessage = '';
  }
}
