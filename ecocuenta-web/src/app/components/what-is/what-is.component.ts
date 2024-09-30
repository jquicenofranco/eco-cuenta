import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-what-is',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './what-is.component.html',
  styleUrl: './what-is.component.css'
})
export class WhatIsComponent {

}
