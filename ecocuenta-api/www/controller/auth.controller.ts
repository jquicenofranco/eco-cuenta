import { Request, Response } from 'express';
import { HttpResponse } from "../helpers/http.response.helper";
import { JwtHelper } from "../helpers/jwt.helper";

export class AuthController {
    constructor(
        private readonly _httpResponse: HttpResponse = new HttpResponse(),
    ) { }

    public async SignInWithGestor(req: Request, res: Response) {
        try {
            const jwtData: any = await JwtHelper.ValidateJwtWithGestorAsync(req);

            return this._httpResponse.Ok(res, {
                usuario: jwtData.usuario,
                accessToken: jwtData.accessToken
            });
        } catch (error) {
            return this._httpResponse.Error(res, error);
        }
    }
}