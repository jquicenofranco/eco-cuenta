import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecocuenta-web';

  private backgroundImages = [
    'assets/background/background-1.png',
    'assets/background/background-2.png',
  ];

  currentBackground: string = this.setRandomBackground();

  constructor() {}

  ngOnInit() {
    setInterval(() => {
      this.currentBackground = this.setRandomBackground();
    }, 60000);
  }

  private setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * this.backgroundImages.length);
    const selectedImage = this.backgroundImages[randomIndex];
    return `url('${selectedImage}')`;
  }
}
