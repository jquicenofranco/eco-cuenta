import { AnswerService } from '../../services/answer.service';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IAnswer, IAnswerSelected } from '../../interfaces/answer/answer.interface';
import { IQuestion } from '../../interfaces/question/question.interface';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { QuestionService } from '../../services/question.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { SuggestionDialogComponent } from '../suggestion-dialog/suggestion-dialog.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  imageSrc: string = 'assets/bajo.png';

  constructor(
    private dialog: MatDialog,
    private _answerService: AnswerService,
    private _questionService: QuestionService
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
        this.carbonValue -= (weightAnswer || 0) * 5;
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
          this.carbonValue += (weightAnswer || 0) * 5;
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
    this.imageSrc = 'assets/bajo.png';
    this.showCalculateBotton = false;
    this.showQuestion(this.currentQuestionIndex);
  }

  private openUserInfoDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '450px',
      data: { name: '', email: '' }
    });

    return dialogRef.afterClosed();
  }

  private openSuggestionsDialog(suggestions: { level: string, recommendations: string }) {
    const dialogRef = this.dialog.open(SuggestionDialogComponent, {
      width: 'auto',
      data: { suggestions }
    });

    return dialogRef.afterClosed();
  }

  private openDialog() {
    const obj = Object.fromEntries(this.answers);
    const answerSelected = Object.entries(obj).map(([key, value]) => ({ ...value }));
    const storedData = localStorage.getItem('userInfo');
    let answer: IAnswer = { userName: '', userEmail: '', answerSelected };

    // if (storedData) {
    //   const userInfo = JSON.parse(storedData);
    //   answer.userName = userInfo.name;
    //   answer.userEmail = userInfo.email;
    //   this.CalculateAnswer(answer);
    //   return;
    // }

    this.openUserInfoDialog().subscribe(result => {
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
    this._answerService
      .CalculateAnswer(answer)
      .subscribe((r => {
        this.openSuggestionsDialog(r);
        this.resetQuiz();
      }));
  }

  private updateThermometer() {
    if (this.carbonValue == 0) return;

    if (this.carbonValue < 100) {
      this.imageSrc = 'assets/bajo.png';
    } else if (this.carbonValue >= 100 && this.carbonValue < 170) {
      this.imageSrc = 'assets/medio.png';
    } else if (this.carbonValue >= 170 && this.carbonValue < 200) {
      this.imageSrc = 'assets/medio-alto.png';
    } else {
      this.imageSrc = 'assets/alto.png';
    }
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
