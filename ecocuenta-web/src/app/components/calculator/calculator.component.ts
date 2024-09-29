import { AnswerService } from '../../services/answer.service';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IAnswer, IAnswerSelected } from '../../interfaces/answer/answer.interface';
import { IQuestion } from '../../interfaces/question/question.interface';
import { Observable, of } from 'rxjs';
import { QuestionService } from '../../services/question.service';
import { UserInfoDialogService } from '../../services/user-dialog.service';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
})
export class CalculatorComponent implements OnInit {
  answers: Map<number, IAnswerSelected> = new Map<number, IAnswerSelected>();
  carbonValue: number = 0;
  currentQuestion: IQuestion | null = null;
  currentQuestionIndex: number = 0;
  questions: IQuestion[] = [];
  selectedAnswer: IAnswerSelected | null = null;
  errormessageclass = 'error-message-display-none';
  showCalculateBotton = false;

  fillColor: string = 'rgb(0%,0%,0%)';

  constructor(
    private _answerService: AnswerService,
    private _questionService: QuestionService,
    private _userInfoDialog: UserInfoDialogService
  ) { }

  ngOnInit(): void {
    this.updateThermometer();

    this.getQuestions().subscribe(questions => {
      this.questions = questions;
      this.showQuestion(this.currentQuestionIndex);
    });
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showQuestion(this.currentQuestionIndex);
      // Seleccionar la respuesta previa si existe
      this.selectedAnswer = this.answers.get(this.currentQuestionIndex) || null;

      if (this.selectedAnswer != null) {
        const question = this.questions[this.currentQuestionIndex];
        const weightAnswer = question.answers.find(a => a.answer == this.selectedAnswer?.answer)?.weight || null;
        this.carbonValue -= weightAnswer || 0;
      }
    }

    this.showCalculateBotton = false;

    this.updateThermometer();
  }

  nextQuestion() {
    if (this.validateAnswer()) {
      this.saveAnswer();
      if (this.currentQuestionIndex <= this.questions.length) {
        if (this.selectedAnswer != null) {
          const question = this.questions[this.currentQuestionIndex];
          const weightAnswer = question.answers.find(a => a.answer == this.selectedAnswer?.answer)?.weight || null;
          this.carbonValue += weightAnswer || 0;
        }

        this.currentQuestionIndex++;
        this.showQuestion(this.currentQuestionIndex);
        // Seleccionar la respuesta previa si existe
        this.selectedAnswer = this.answers.get(this.currentQuestionIndex) || null;
      }

      if (this.currentQuestionIndex + 1 == this.questions.length) {
        this.showCalculateBotton = true;
      }

      this.updateThermometer();
    }
  }

  calculate() {
    if (this.validateAnswer()) {
      this.saveAnswer();
      this.openDialog();
    }
  }

  resetQuiz() {
    localStorage.removeItem('quizAnswers');
    this.answers.clear();
    this.currentQuestionIndex = 0;
    this.carbonValue = 0;
    this.fillColor = 'rgb(0%,0%,0%)';
    this.showQuestion(this.currentQuestionIndex);
  }

  private openDialog() {
    const obj = Object.fromEntries(this.answers);
    const answerSelected = Object.entries(obj).map(([key, value]) => ({ ...value }));
    const storedData = localStorage.getItem('userInfo');
    let answer: IAnswer = { userName: '', userEmail: '', answerSelected };

    if (storedData) {
      const userInfo = JSON.parse(storedData);
      answer.userName = userInfo.name;
      answer.userEmail = userInfo.email;
      this.CalculateAnswer(answer);
      return;
    }

    this._userInfoDialog.openUserInfoDialog().subscribe(result => {
      if (result === false) {
        console.log('Diálogo cerrado sin enviar');
      } else if (result) {
        answer.userName = result.name;
        answer.userEmail = result.email;
        this.CalculateAnswer(answer);

        localStorage.setItem('userInfo', JSON.stringify(result));
        localStorage.setItem('quizAnswers', JSON.stringify(this.answers));
      }
    });
  }

  private CalculateAnswer(answer: IAnswer) {
    this._answerService.CalculateAnswer(answer).subscribe((r => {
      this.currentQuestion = { id: 1, question: r, answers: [] };
    }));
  }

  private getColor(value: number): number[] {
    if (value <= 25) {
      return [0, 255, 0]; // Verde
    } else if (value <= 50) {
      return [255, 255, 0]; // Amarillo
    } else if (value <= 75) {
      return [255, 165, 0]; // Naranja
    } else {
      return [255, 0, 0]; // Rojo
    }
  }

  private interpolateColor(color1: number[], color2: number[], factor: number): string {
    const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
  }

  private updateThermometer() {
    if (this.carbonValue == 0) return;

    const value = this.carbonValue;
    const baseColor = this.getColor(Math.floor(value / 25) * 25);
    const nextColor = this.getColor(Math.min(Math.ceil(value / 25) * 25, 100));
    const interpolationFactor = (value % 25) / 25;

    const color = this.interpolateColor(baseColor, nextColor, interpolationFactor);
    this.fillColor = color;
  }

  private validateAnswer(): boolean {
    const isValid = this.selectedAnswer !== null;
    (isValid) ? this.errormessageclass = 'error-message-display-none' : this.errormessageclass = 'error-message-display';
    return isValid;
  }

  private saveAnswer() {
    if (this.selectedAnswer !== null) {
      this.answers.set(this.currentQuestionIndex, this.selectedAnswer);
    }
  }

  private showQuestion(index: number) {
    this.currentQuestion = this.questions[index];
    // Si hay una respuesta guardada para esta pregunta, la seleccionamos
    this.selectedAnswer = this.answers.get(index) || null;
  }

  private getQuestions(): Observable<IQuestion[]> {
    return this._questionService.questions$;
  }
}
