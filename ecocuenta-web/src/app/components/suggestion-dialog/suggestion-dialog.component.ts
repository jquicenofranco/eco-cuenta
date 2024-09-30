import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: { text: string }) {}
}
