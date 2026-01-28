import { config } from "dotenv";
import path from "path";
import { cwd } from "process";


config({path: path.join(cwd(), '.env')});

export const dbUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
