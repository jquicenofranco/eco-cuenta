import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsConditionsComponent {
  mostrarTexto: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TermsConditionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { acepta: boolean }
  ) { }

  ngOnInit(): void {
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  RespuestaContrato(respuesta: boolean) {
    this.dialogRef.close(respuesta);
  }
}
