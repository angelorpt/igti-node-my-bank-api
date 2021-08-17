import express from "express";
import config from "config";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let account = req.body;
    const dbFile = await readFile(config.get("accounts.file"));
    const data = JSON.parse(dbFile);

    account = { id: data.nextId, ...account };
    data.nextId++;
    data.accounts.push(account);

    await writeFile(config.get("accounts.file"), JSON.stringify(data));

    res.send(account, 201);
  } catch (error) {
    res.status(400).send({ error });
  }
});

export default router;
