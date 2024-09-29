import { Request, Response } from "express";
import { BaseRouter } from "../helpers/router.helper";
import { AngularController } from "../controller";
import { ToolAdministratorMiddleware } from "../middlewares";

export class AngularRouter extends BaseRouter<AngularController, ToolAdministratorMiddleware> {
    constructor() {
        super(AngularController, ToolAdministratorMiddleware);
    }

    routes(): void {
        this.router.get(
            "/*",
            [],
            (req: Request, res: Response) => this.controller.GetWebPage(req, res)
        );
    }
}