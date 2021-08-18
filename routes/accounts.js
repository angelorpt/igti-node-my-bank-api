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
    const ID = parseInt(req.params.id);
    const dbFile = JSON.parse(await readFile(config.get("accounts.file")));
    const account = dbFile.accounts.find((account) => account.id === ID);
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

// DELETE ID
router.delete("/:id", async (req, res) => {
  try {
    // Params
    const id = parseInt(req.params.id);

    // DBFile
    const dbFile = JSON.parse(await readFile(config.get("accounts.file")));

    // Check exists
    const account = dbFile.accounts.find((account) => account.id === id);
    if (!account) {
      res.send({ message: "Recurso não encontrado" }, 404);
    }

    // Removendo Recurso
    const data = {
      nextId: dbFile.nextId,
      accounts: dbFile.accounts.filter((acc) => acc.id != id),
    };

    // Salvando os dados
    await writeFile(config.get("accounts.file"), JSON.stringify(data));

    // Retorno API
    res.send({ message: "Recurso deletado" });
  } catch (error) {
    res.send({ error }, 400);
  }
});

export default router;
