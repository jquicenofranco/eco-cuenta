import { Request, Response, NextFunction } from 'express';
import { SharedMiddleware } from "./shared.middleware";

export class ToolAdministratorMiddleware extends SharedMiddleware {
    constructor() {
        super();
    }

    public async ToolValidator(req: Request, res: Response, next: NextFunction) {
        try {
            next();
        } catch (error) {
            res.status(401).json(error);
        }
    }
}