import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ SharedModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  urlReporte = 'https://view.genially.com/66fef5e8fc1a448482935077/interactive-content-genially-sin-titulo';
}
