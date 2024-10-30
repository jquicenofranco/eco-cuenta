import { HttpResponse } from "../helpers/http.response.helper";
import { Request, Response } from "express";
import Question from "../models/question.entity";

export class QuestionController {
    constructor(
        private readonly _httpResponse: HttpResponse = new HttpResponse(),
    ) { }

    public async GetAllQuestions(req: Request, res: Response) {
        try {
            const questions = await Question.findAll();
            this._httpResponse.Ok(res, questions);
        } catch (error) {
            this._httpResponse.Error(res, error);
        }
    }
}