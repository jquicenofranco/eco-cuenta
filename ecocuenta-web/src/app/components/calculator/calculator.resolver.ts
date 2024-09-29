import { inject } from "@angular/core";
import { IQuestion } from "../../interfaces/question/question.interface";
import { QuestionService } from "../../services/question.service";
import { ResolveFn } from "@angular/router";

export const calculatorResolver: ResolveFn<IQuestion[]> = (route, state) => {
    const questionService = inject(QuestionService);
    return questionService.GetAllQuestions();
}