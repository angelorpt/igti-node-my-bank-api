import express from "express";
import accountsRouter from "./routes/account.routes.js";
import config from "config";
import winston from "winston";
import cors from "cors";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "my-bank-api.log" }),
  ],
  format: combine(label({ label: "my-bank-api" }), timestamp(), myFormat),
});

const app = express();
app.use(express.json());
app.use(cors());
app.use("/accounts", accountsRouter);

app.listen(3000, async () => {
  try {
    await readFile(config.get("accounts.file"));
  } catch (error) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    try {
      await writeFile(config.get("accounts.file"), JSON.stringify(initialJson));
      logger.info("API Started!");
    } catch (error) {
      logger.error("Fail to Start", error);
    }
  }
});
