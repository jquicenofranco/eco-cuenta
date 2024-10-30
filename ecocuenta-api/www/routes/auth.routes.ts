import { AuthController } from "../controller";
import { BaseRouter } from "../helpers/router.helper";
import { JwtValidatorMiddleware } from "../middlewares";
import { Request, Response } from "express";

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