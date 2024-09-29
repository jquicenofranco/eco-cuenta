import { Request, Response } from "express";
import { BaseRouter } from "../helpers/router.helper";
import { AuthController } from "../controller";
import { JwtValidatorMiddleware } from "../middlewares";

export class AuthRouter extends BaseRouter<AuthController, JwtValidatorMiddleware> {
    constructor() {
        super(AuthController, JwtValidatorMiddleware);
    }

    routes(): void {
        this.router.post(
            "/auth/signInWithGestor",
            [this.middleware.JwtValidator],
            (req: Request, res: Response) => this.controller.SignInWithGestor(req, res)
        );
    }
}