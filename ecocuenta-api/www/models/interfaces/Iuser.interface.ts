export interface IUser {
    id_usuario: number;
    nombre: string;
    apellido: string;
    id_genero: number;
    nickname: string;
    descripcion: string;
    avatar: string;
    email: string;
    empresa: string;
    id_area: number;
    auth_google: boolean;
    estado: string;
    acepta_condiciones: boolean;
}

export class IAcceso {
    id_acceso?: number;
    id_perfil?: number;
    id_usuario?: number;
    Perfil?: IPerfil;
}

export class IPerfil {
    id_perfil?: number | null;
    id_aplicativo!: number;
    id_rol!: number;
    Aplicativo?: IAplicativo;
    Rol?: IRol;
}

export class IRol {
    id_rol!: number;
    nombre!: string;
}

export class IAplicativo {
    id_aplicativo?: number | null;
    nombre_aplicativo!: string;
    url_aplicativo!: string;
    url_avatar!: string;
    descripcion!: string;
    llave_aplicativo?: string;
    iniciales?: string;
}

export interface IJwtResult {
    usuario: IUser;
    accessToken: string;
    publicKey: string;
}