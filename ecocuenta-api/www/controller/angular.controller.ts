import { Request, Response } from "express";

export class AngularController {
    constructor() { }

    public async GetWebPage(req: Request, res: Response) {
        res.sendFile('index.html', { root: 'public/' });
    }
}