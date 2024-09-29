import { NextFunction, Request, Response } from "express";
import axios from "axios";

// Helpers
import { HttpResponse } from "../helpers/http.response.helper";
import { JwtHelper } from "../helpers/jwt.helper";

export class SharedMiddleware {
  constructor(public httpResponse: HttpResponse = new HttpResponse()) { }

  public async PassAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenHeader = JwtHelper.GetJwtHeader(req);

      if (!tokenHeader) {
        throw new Error("No se identificó el token");
      }

      await axios.post(`${process.env.URLGESTOR}autenticacion/validarJwt`, {}, tokenHeader)
        .then(async (response) => {
          next();
        })
        .catch((error) => {
          console.log(error);
          throw new Error("No se logró obtener el usuario");
        });
    } catch (error) {
      res.status(401).json(error);
    }
  }
}
