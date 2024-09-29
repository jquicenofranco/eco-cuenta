import { IAnswerQ } from "./answer-q.interface";

export interface IQuestion {
    id: number;
    question: string;
    answers: IAnswerQ[]; // Array de objetos `Answer`
}