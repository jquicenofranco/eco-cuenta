import * as dotenv from "dotenv";
import sequelizePostgreSql from "./data.source";

export abstract class ConfigServer {
  constructor() {
    const nodeNameEnv = this.CreatePathEnv(this.nodeEnv);
    dotenv.config({
      path: nodeNameEnv,
    });
  }

  public GetEnvironment(k: string): string | undefined {
    return process.env[k];
  }

  public GetNumberEnv(k: string): number {
    return Number(this.GetEnvironment(k));
  }

  public get nodeEnv(): string {
    return this.GetEnvironment("NODE_ENV")?.trim() || "";
  }

  public CreatePathEnv(path: string): string {
    const arrEnv: Array<string> = ["env"];

    if (path.length > 0) {
      const stringToArray = path.split(".");
      arrEnv.unshift(...stringToArray);
    }
    return "." + arrEnv.join(".");
  }

  public get initPostgreSqlConnection(): Promise<void> {
    return sequelizePostgreSql.authenticate();
  }
}
