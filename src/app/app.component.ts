import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  selectedProxy: string = 'none';
  proxyStatus: string = '';

  // Available proxy services
  proxyServices = [
    { id: 'none', name: 'No Proxy (Direct)', description: 'Load games directly without proxy' },
    { id: 'cors-anywhere', name: 'CORS Anywhere', description: 'Bypass CORS restrictions' },
    { id: 'allorigins', name: 'AllOrigins', description: 'Universal CORS proxy service' },
    { id: 'corsproxy', name: 'CORS Proxy', description: 'Fast CORS proxy for web apps' },
    { id: 'custom', name: 'Custom Proxy', description: 'Use our custom proxy server' }
  ];

  // Preset game URLs - tested and working
  presetGames = [
    { name: 'Chess', url: 'https://playpager.com/embed/chess/index.html' },
    { name: '2048', url: 'https://play2048.co/' },
    { name: 'Snake Game', url: 'https://snake-game.io/' },
    { name: 'Tetris', url: 'https://tetris.com/play-tetris' },
    { name: 'Minesweeper', url: 'https://minesweeper.online/' },
    { name: 'Othello', url: 'https://playpager.com/embed/othello/index.html' }
  ];

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

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
    this.proxyStatus = '';
    
    // Load game with selected proxy
    this.loadGameWithProxy(this.gameUrl, this.selectedProxy);
  }

  loadGameWithProxy(url: string, proxyType: string) {
    let finalUrl = url;

    switch (proxyType) {
      case 'cors-anywhere':
        finalUrl = `/api/proxy/${encodeURIComponent(url)}`;
        break;
      case 'allorigins':
        finalUrl = `/proxy/allorigins/raw?url=${encodeURIComponent(url)}`;
        break;
      case 'corsproxy':
        finalUrl = `/proxy/corsproxy/${encodeURIComponent(url)}`;
        break;
      case 'custom':
        finalUrl = `/proxy/custom?url=${encodeURIComponent(url)}`;
        break;
      case 'none':
      default:
        finalUrl = url;
        break;
    }

    // Test proxy connection first
    if (proxyType !== 'none') {
      this.testProxyConnection(proxyType).then(success => {
        if (success) {
          this.proxyStatus = `✅ ${this.proxyServices.find(p => p.id === proxyType)?.name} connected`;
          this.loadGameFrame(finalUrl);
        } else {
          this.proxyStatus = `❌ ${this.proxyServices.find(p => p.id === proxyType)?.name} failed - trying direct connection`;
          this.loadGameFrame(url);
        }
      }).catch(() => {
        this.proxyStatus = `❌ ${this.proxyServices.find(p => p.id === proxyType)?.name} failed - trying direct connection`;
        this.loadGameFrame(url);
      });
    } else {
      this.loadGameFrame(finalUrl);
    }
  }

  testProxyConnection(proxyType: string): Promise<boolean> {
    const testUrls = {
      'cors-anywhere': '/api/proxy/https://httpbin.org/get',
      'allorigins': '/proxy/allorigins/raw?url=https://httpbin.org/get',
      'corsproxy': '/proxy/corsproxy/https://httpbin.org/get',
      'custom': '/proxy/custom?url=https://httpbin.org/get'
    };

    const testUrl = testUrls[proxyType as keyof typeof testUrls];
    if (!testUrl) return Promise.resolve(true);

    return this.http.get(testUrl).pipe(
      timeout(5000),
      catchError(() => of(false))
    ).toPromise()
      .then((result) => result !== false)
      .catch(() => false);
  }

  loadGameFrame(url: string) {
    // Simulate loading time
    setTimeout(() => {
      this.currentGameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.isLoading = false;
    }, 500);
  }

  getProxyName(proxyId: string): string {
    const proxy = this.proxyServices.find(p => p.id === proxyId);
    return proxy ? proxy.name : 'Unknown';
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
