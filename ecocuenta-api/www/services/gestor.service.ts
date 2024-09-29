import { IAcceso, IUser } from "../models/interfaces/Iuser.interface";
import { JwtHelper } from "../helpers/jwt.helper";
import { MessageEncryptionService } from ".";
import { Request } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export class GestorService {
    private _message: string;
    private _privateKey: string;
    private _toolKey: string;

    constructor() {
        this._privateKey = process.env.PRIVATE_KEY || '';
        this._toolKey = process.env.TOOL_KEY || '';

        MessageEncryptionService.initialize(this._privateKey);
        this._message = MessageEncryptionService.encryptMessage(this._toolKey);
    }

    /**
     * Get User's data from Gestor
     * @param req 
     * @param id_usuario 
     * @returns 
     */
    public async GetUserDataAsync(req: Request, id_usuario: number): Promise<IUser | undefined> {
        const config: AxiosRequestConfig = JwtHelper.GetJwtHeader(req);
        if (!config) throw new Error("No encontró el jwt");

        return await this.RequestUserDataAsync(config, id_usuario);
    }

    public async GetUserDataWithTokenAsync(token: string, id_usuario: number): Promise<IUser | undefined> {
        if (!token) throw new Error("No encontró el jwt");

        const config: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${token}` }
        };

        return await this.RequestUserDataAsync(config, id_usuario);
    }

    public async GetUserDataAccesWithTokenAsync(token: string, id_usuario: number) {
        if (!token) throw new Error("No encontró el jwt");

        const config: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${token}` }
        };

        return await axios.get<{ usuario: IUser, Accesos: IAcceso[] }>(`${process.env.URLGESTOR}acceso/usuario/${id_usuario}`, config)
            .then(async (response) => response.data)
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }

    private async RequestUserDataAsync(config: AxiosRequestConfig, id_usuario: number): Promise<IUser | undefined> {
        if (!config) throw new Error("No encontró el jwt");

        return await axios.get<IUser>(`${process.env.URLGESTOR}usuario/${id_usuario}`, config)
            .then(async (response) => {
                return response.data as IUser;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }

    /**
     * List of users belonging to the application
     * @param token 
     * @returns 
     */
    public async GetListUserHspAsync(token: string) {
        if (!token) throw new Error("No encontró el jwt");

        const config: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${token}` }
        };

        return await axios.get<{ usuario: IUser, Accesos: IAcceso[] }[]>(`${process.env.URLGESTOR}usuario/usuariosxapp/${process.env.ID_SERVICIO_HSP}?search=`, config)
            .then(async (response) => response.data as { usuario: IUser, Accesos: IAcceso[] }[])
            .catch((error) => {
                throw new Error(`Se presentó un error en la consulta: ${error}`);
            });
    }

    /**
     * Get a list of Users with it's data from Gestor
     * @param req 
     * @returns 
     */
    public async GetListUserDataAsync(req: Request): Promise<IUser[] | undefined> {
        const config: AxiosRequestConfig = JwtHelper.GetJwtHeader(req);
        if (!config) throw new Error("No encontró el jwt");

        return await axios.get<any>(`${process.env.URLGESTOR}usuario?page=&size=&sort=nombre&order=asc&search=`, config)
            .then(async (response) => {
                const { usuarios } = response.data;
                return usuarios as IUser[];
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }

    /**
     * Request the token for tool
     * @returns 
     */
    public async RequestTokenByTool(attempt = 1): Promise<string> {
        try {
            const response: AxiosResponse<string> = await axios.post<string>(`${process.env.URLGESTOR}autenticacion/loginHerramienta`, { message: this._message });

            if (response.status === 200) {
                return response.data;
            } else {
                if (attempt < 3) {
                    return this.RequestTokenByTool(attempt + 1);
                } else {
                    throw new Error('No se logró obtener el token');
                }
            }
        } catch (error) {
            if (attempt < 3) {
                return this.RequestTokenByTool(attempt + 1);
            } else {
                throw new Error(`Se presentó un error en la consulta: ${error}`);
            }
        }
    }
}