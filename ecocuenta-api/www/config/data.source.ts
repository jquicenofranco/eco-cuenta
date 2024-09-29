import { Sequelize } from 'sequelize';
import * as dotenv from "dotenv";

dotenv.config({
  path:
    process.env.NODE_ENV !== undefined
      ? `.${process.env.NODE_ENV.trim()}.env`
      : ".env",
});

const sequelizePostgreSqlConnection = new Sequelize(
  process.env.DB_DATABASE || 'ecocuenta_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '123456789', {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    omitNull: true
  },
  logging: false,
});

export default sequelizePostgreSqlConnection;