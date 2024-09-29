import { CalculatorComponent } from './components/calculator/calculator.component';
import { calculatorResolver } from './components/calculator/calculator.resolver';
import { HomeComponent } from './components/home/home.component';
import { Routes } from '@angular/router';
import { WhatIsComponent } from './components/what-is/what-is.component';

export const routes: Routes = [
    { path: '*', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'whatis', component: WhatIsComponent },
    { path: 'calculator', component: CalculatorComponent, resolve: { calculator: calculatorResolver } },
];
