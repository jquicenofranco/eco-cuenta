export interface IAnswer {
    id: number;
    userName: string;
    userEmail: string;
    answerSelected: IAnswerSelected[];
}

export interface IAnswerSelected {
    question: string;
    answer: string;
    weight: number;
}