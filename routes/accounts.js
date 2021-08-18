import express from "express";
import config from "config";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();

// GET
router.get("/", async (req, res) => {
  try {
    const dbFile = JSON.parse(await readFile(config.get("accounts.file")));
    res.send(dbFile.accounts);
  } catch (error) {
    res.send({ error }, 400);
  }
});

// GET ID
router.get("/:id", async (req, res) => {
  try {
    const ID = req.params.id;
    const dbFile = JSON.parse(await readFile(config.get("accounts.file")));
    const account = dbFile.accounts.find((account) => account.id == ID);
    if (!account) {
      res.send({ message: "Não encontrado" }, 404);
    }
    res.send(account);
  } catch (error) {
    res.send({ error }, 400);
  }
});

// POST
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
