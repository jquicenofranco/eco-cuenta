import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

interface Question {
  question: string;
  answers: string[];
  weightAnswers: number[];
}

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
  answers: Map<number, string> = new Map();
  carbonValue: number = 0;
  currentQuestion: Question | null = null;
  currentQuestionIndex: number = 0;
  questions: Question[] = [];
  selectedAnswer: string | null = null;
  selectedPointAnswer: string | null = null;
  errormessageclass = 'error-message-display-none';
  showCalculateBotton = false;

  fillColor: string = 'rgb(0%,0%,0%)';

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
      this.carbonValue -= 10;
      this.showQuestion(this.currentQuestionIndex);
      // Seleccionar la respuesta previa si existe
      this.selectedAnswer = this.answers.get(this.currentQuestionIndex) || null;
    }

    this.showCalculateBotton = false;

    this.updateThermometer();
  }

  nextQuestion() {
    if (this.validateAnswer()) {
      this.saveAnswer();
      if (this.currentQuestionIndex <= this.questions.length) {
        if (this.selectedAnswer != null) {
          const questions = this.questions[this.currentQuestionIndex];
          const answerIndex = questions.answers.indexOf(this.selectedAnswer);
          const weightAnswer = questions.weightAnswers[answerIndex] || null;
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
      localStorage.setItem('quizAnswers', JSON.stringify(this.answers));
    }
  }

  resetQuiz() {
    localStorage.removeItem('quizAnswers');
    this.answers = new Map();
    this.currentQuestionIndex = 0;
    this.showQuestion(this.currentQuestionIndex);
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

  private getQuestions(): Observable<Question[]> {
    return of([
      {
        question: "1. ¿Qué clima tiene la región dónde vives?",
        answers: ["Cálido", "Templado", "Frío"],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "2. ¿En qué tipo de vivienda habitas?",
        answers: ["Casa en zona urbana", "Casa en zona rural", "Casa o apartamento en propiedad horizontal"],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "3. ¿Con cuántas personas convives en tu hogar?",
        answers: ["Vivo solo", "2-3 personas", "4-5 personas", "Más de 5 personas"],
        weightAnswers: [10, 20, 30, 40]
      },
      {
        question: "4. ¿Cuántos m³ de agua consumes al mes?",
        answers: ["1 a 10", "10 a 50", "mas de 50"],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "5. ¿Cuántos minutos tardas en la ducha?",
        answers: ["Menos de 5 minutos", "Entre 5 a 10 minutos", "Más de 10 minutos"],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "6. ¿Cuántas veces en el día descargas el agua del inodoro?",
        answers: ["Menos de 2 veces", "Entre 3 a 5 veces", "Más de 5 veces"],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "7. ¿Cuántas veces en la semana lavas tu ropa?",
        answers: ["1 vez a la semana", "2-3 veces a la semana", "Diariamente"],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "8. ¿Recolectas aguas lluvias o de la lavadora?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "9. ¿Desechas aceites en el lavaplatos?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "10. ¿Para asearte y lavar tu ropa usas productos ecológicos?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "11. ¿Quitas los restos de comida de los platos antes de lavarlos?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "12. ¿Acostumbras a verter agua caliente en tu lavaplatos?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "13. ¿Separas tus residuos aprovechables?",
        answers: ["No, me da pereza.", "No, no sé cómo hacerlo.", "Sí, separo algunos residuos.", "Sí, tengo todo en orden y además conozco al reciclador de mi zona."],
        weightAnswers: [10, 20, 30, 40]
      },
      {
        question: "14. ¿Cuántas bolsas de residuos sacas en una semana?",
        answers: ["Todos los días saco bolsas.", "2 veces por semana.", "1 vez a la semana."],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "15. ¿Le das un segundo uso a lo que consideras que son residuos?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "16. ¿Compras elementos que puedan ser retornados a un ciclo?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "17. ¿Cuánto kWh de energía consumes en el mes?",
        answers: ["1 a 10", "10 a 50", "mas de 50"],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "18. ¿Usas bombillos ahorradores?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "19. ¿Eliges los electrodomésticos con etiquetas que garantizan el ahorro de energía?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "20. ¿Mantienes encendidas todas las luces cuando estás en casa?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "21. ¿Desconectas tus electrodomésticos cuando no los estás usando?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "22. Si vives en clima cálido ¿Apagas el aire acondicionado cuando no estás en casa?",
        answers: ["Sí", "No", "N/A"],
        weightAnswers: [10, 20, 0]
      },
      {
        question: "23. ¿Alistas tus alimentos refrigerados antes de cocinar?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "24. ¿Tienes gas natural en casa o pipeta de gas?",
        answers: ["Sí", "No", "N/A"],
        weightAnswers: [10, 20, 0]
      },
      {
        question: "25. ¿Cuánto m³ de gas consumes en el mes?",
        answers: ["1 a 10", "10 a 50", "mas de 50"],
        weightAnswers: [10, 20, 30]
      },
      {
        question: "26. ¿Haces mantenimiento a tus electrodomésticos de gas?",
        answers: ["Sí, a todos mis electrodomésticos.", "Sí, solo la revisión reglamentaria por la empresa de gas.", "Sí, a algunos electrodomésticos de gas.", "Nunca hago revisiones."],
        weightAnswers: [10, 20, 30, 40]
      },
      {
        question: "27. ¿Tapas tus ollas cuando cocinas o calientas algunos de tus alimentos?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "28. ¿Cierras el punto de gas cuando terminas de cocinar?",
        answers: ["Sí", "No"],
        weightAnswers: [10, 20]
      },
      {
        question: "29. ¿Descongelas tus alimentos antes de cocinar?",
        answers: ["Sí", "A veces", "No"],
        weightAnswers: [10, 20, 30]
      }
    ]);
  }
}
