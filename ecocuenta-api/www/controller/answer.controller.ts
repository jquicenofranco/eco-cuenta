import { HttpResponse } from "../helpers/http.response.helper";
import { IAnswer } from "../models/interfaces";
import { Request, Response } from "express";
import Answer from "../models/answer.entity";

export class AnswerController {
    constructor(
        private readonly _httpResponse: HttpResponse = new HttpResponse(),
    ) { }

    public async SaveAnswer(req: Request, res: Response) {
        try {
            const answer: IAnswer = req.body;
            const newAnswer = await Answer.create({ ...answer });
            this._httpResponse.Created(res, newAnswer);
        } catch (error) {
            return this._httpResponse.Error(res, error);
        }
    }
}