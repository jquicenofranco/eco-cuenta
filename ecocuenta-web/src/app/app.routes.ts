import { CalculatorComponent } from './calculator/calculator.component';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { WhatIsComponent } from './what-is/what-is.component';

export const routes: Routes = [
    { path: '*', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'whatis', component: WhatIsComponent },
    { path: 'calculator', component: CalculatorComponent },
];
