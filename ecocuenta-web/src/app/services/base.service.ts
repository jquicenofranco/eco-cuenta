import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BaseService {
    protected _urlServer = environment.URLSERVICIO;

    constructor() { }
}