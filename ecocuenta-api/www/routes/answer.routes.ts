import { AnswerController } from "../controller";
import { BaseRouter } from "../helpers/router.helper";
import { JwtValidatorMiddleware } from "../middlewares";
import { Request, Response } from "express";

export class AnswerRouter extends BaseRouter<AnswerController, JwtValidatorMiddleware> {
    constructor() {
        super(AnswerController, JwtValidatorMiddleware);
    }

    routes(): void {
        this.router.post(
            "/answer",
            [this.middleware.JwtValidator],
            (req: Request, res: Response) => this.controller.SaveAnswer(req, res)
        );
    }
}