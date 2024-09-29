import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuestion } from '../interfaces/question/question.interface';
import { IServerResponse } from '../interfaces/response/server-response.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService extends BaseService {
  private _questions: ReplaySubject<IQuestion[]> = new ReplaySubject<IQuestion[]>(1);

  constructor(private http: HttpClient) { super(); }

  set questions(value: IQuestion[]) {
    this._questions.next(value);
  }

  get questions$(): Observable<IQuestion[]> {
    return this._questions.asObservable();
  }

  GetAllQuestions() {
    return this.http.get<IServerResponse>(`${this._urlServer}question`)
      .pipe(
        tap((r: IServerResponse) => this._questions.next(r.data as IQuestion[])),
        map((v: IServerResponse) => v.data as IQuestion[])
      );
  }
}
