import { BaseRouter } from "../helpers/router.helper";
import { JwtValidatorMiddleware } from "../middlewares";
import { QuestionController } from "../controller";
import { Request, Response } from "express";

export class QuestionRouter extends BaseRouter<QuestionController, JwtValidatorMiddleware> {
    constructor() {
        super(QuestionController, JwtValidatorMiddleware);
    }

    routes(): void {
        this.router.get(
            "/question",
            [this.middleware.JwtValidator],
            (req: Request, res: Response) => this.controller.GetAllQuestions(req, res)
        );
    }
}