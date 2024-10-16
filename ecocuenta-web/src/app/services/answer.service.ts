import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuestion } from '../interfaces/question/question.interface';
import { IServerResponse } from '../interfaces/response/server-response.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { IAnswer } from '../interfaces/answer/answer.interface';

@Injectable({
  providedIn: 'root'
})
export class AnswerService extends BaseService {
  private _respuesta: ReplaySubject<{ level: string, recommendations: string }> = new ReplaySubject<{ level: string, recommendations: string }>(1);

  constructor(private http: HttpClient) { super(); }

  set respuesta(value: { level: string, recommendations: string }) {
    this._respuesta.next(value);
  }
  get respuesta$(): Observable<{ level: string, recommendations: string }> {
    return this._respuesta.asObservable();
  }

  CalculateAnswer(answerSelected: IAnswer): Observable<{ level: string, recommendations: string }> {
    return this.http.post<IServerResponse>(`${this._urlServer}answer`, answerSelected)
      .pipe(
        tap((r: IServerResponse) => this._respuesta.next(r.data)),
        map((v: IServerResponse) => v.data as { level: string, recommendations: string })
      );
  }
}
