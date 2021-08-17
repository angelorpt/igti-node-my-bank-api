import express from "express";
import accountsRouter from "./routes/accounts.js";
import config from "config";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());

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
      console.log("API Started!");
    } catch (error) {
      console.log("Fail to Start", error);
    }
  }
});
