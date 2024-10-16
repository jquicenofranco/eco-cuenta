import { ChangeDetectionStrategy, Component, Inject, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-suggestion-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './suggestion-dialog.component.html',
  styleUrl: './suggestion-dialog.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestionDialogComponent {
  imageSrc: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { suggestions: { level: string, recommendations: string } }) { }

  ngOnInit() {
    this.setImageSrc();
  }

  setImageSrc() {
    switch (this.data.suggestions.level) {
      case 'alto':
        this.imageSrc = 'assets/nivel-alto.png';
        break;
      case 'medio':
        this.imageSrc = Math.random() < 0.5 ? 'assets/nivel-medio.png' : 'assets/nivel-medio-bajo.png';
        break;
      case 'bajo':
        this.imageSrc = 'assets/nivel-bajo.png';
        break;
      default:
        this.imageSrc = 'assets/nivel-bajo.png';
    }
  }
}
