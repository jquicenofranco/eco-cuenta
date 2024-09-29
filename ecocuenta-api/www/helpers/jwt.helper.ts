import { Request } from 'express';
import axios, { AxiosRequestConfig } from "axios";
import { IJwtResult } from '../models/interfaces/Iuser.interface';

export class JwtHelper {
    constructor() { }

    /**
     * Get the jwt from header of request
     * @param req 
     * @returns 
     */
    public static GetJwtFromRequest(req: Request): string {
        let jwtRespuesta: string | undefined;
        try {
            if (req.body) {
                const { jwt } = req.body;
                jwtRespuesta = jwt;
            }

            if (!jwtRespuesta) {
                jwtRespuesta = req.headers.authorization?.toString().split(" ")[1];
            }

            if (!jwtRespuesta) {
                throw new Error("El token no fué identificado");
            }

            return jwtRespuesta;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                console.log('Unexpected error', error);
                throw new Error('Unexpected error');
            }
        }
    }

    /**
     * Build jwt in header object
     * @param req 
     * @returns 
     */
    public static GetJwtHeader(req: Request): AxiosRequestConfig {
        let jwtRespuesta: string = this.GetJwtFromRequest(req);
        return {
            headers: { Authorization: `Bearer ${jwtRespuesta}` }
        };
    }

    /**
     * Verify if the jwt from request is valid
     * @param req 
     * @returns 
     */
    public static async ValidateJwtWithGestorAsync(req: Request): Promise<IJwtResult | undefined> {
        const config = this.GetJwtHeader(req);
        if (!config) throw new Error("No encontró el jwt");

        return await axios.post<IJwtResult>(`${process.env.URLGESTOR}autenticacion/validarJwt`, {}, config)
            .then(async (response) => {
                return response.data as IJwtResult;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }
}