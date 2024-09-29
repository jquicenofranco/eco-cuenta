import { ConfigServer } from "./config/config";
import cors from "cors";
import express, { RequestHandler } from "express";

//Routes
import {
    AngularRouter,
    AuthRouter,
    AnswerRouter,
    QuestionRouter,
} from "./routes";

export class Server extends ConfigServer {
    public app: express.Application = express();
    private port: number = this.GetNumberEnv("PORT");

    constructor() {
        super();

        this._dbPostgreSqlConnect();

        this.app.use(cors());

        this.app.use(express.json() as RequestHandler);
        this.app.use(express.urlencoded({ extended: true }));

        // Public folder
        this.app.use(express.static('public'));

        // Rounting api
        this.app.use("/api", this._routers());
        // Rounting for angular web
        this.app.use('/', new AngularRouter().router);
    }

    private _routers(): Array<express.Router> {
        return [
            new AnswerRouter().router,
            new AuthRouter().router,
            new QuestionRouter().router,
        ];
    }

    private async _dbPostgreSqlConnect(): Promise<void> {
        return this.initPostgreSqlConnection
            .then(() => {
                console.log("PostgreSql database online");
            })
            .catch((err) => {
                console.error(err);
            });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(
                `Listen in ${this.port} :: ENV = ${this.GetEnvironment("ENV")}`
            );
        });
    }
}