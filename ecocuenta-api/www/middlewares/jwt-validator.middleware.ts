import { NextFunction, Request, Response } from "express";
import { SharedMiddleware } from "./shared.middleware";
import { JwtHelper } from "../helpers/jwt.helper";
import { HttpResponse } from "../helpers/http.response.helper";

export class JwtValidatorMiddleware extends SharedMiddleware {
    constructor(
        private readonly _httpResponse: HttpResponse = new HttpResponse(),
    ) {
        super();
    }

    public async JwtValidator(req: Request, res: Response, next: NextFunction) {
        //TODO: Restablecer este archivo
        next();
        // if (await JwtHelper.ValidateJwtWithGestorAsync(req)) {
        //     next();
        // } else {
        //     res.status(400).send("No se logró validar el token");
        // }
    }
}