import express from "express";
import config from "config";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();

// GET
router.get("/", async (req, res, next) => {
  try {
    // Read DBFile
    const dbFile = JSON.parse(await readFile(config.get("accounts.file")));

    // API Response
    res.send(dbFile.accounts);
  } catch (error) {
    next(err);
  }
});

// GET ID
router.get("/:id", async (req, res, next) => {
  try {
    // Params
    const id = parseInt(req.params.id);

    // Read DBFile
    const dbFile = JSON.parse(await readFile(config.get("accounts.file")));

    // Find Resource
    const account = dbFile.accounts.find((account) => account.id === id);

    // IF Not Exists
    if (!account) {
      res.send({ message: "Não encontrado" }, 404);
    }

    // API Response
    res.send(account);
  } catch (error) {
    next(err);
  }
});

// POST
router.post("/", async (req, res, next) => {
  try {
    // Body Params
    const pAccount = req.body;

    // Read DBFile
    const dbFile = JSON.parse(await readFile(config.get("accounts.file")));

    // New Account
    account = { id: data.nextId, ...account };

    // Update Object DBFile
    data.nextId++;
    data.accounts.push(account);

    // Save DBFile
    await writeFile(config.get("accounts.file"), JSON.stringify(data));

    // API Response
    res.send(account, 201);
  } catch (error) {
    next(err);
  }
});

// PUT
router.put("/:id", async (req, res, next) => {
  try {
    // URL Params
    const pId = parseInt(req.params.id);

    // Body Params
    const pAccount = req.body;

    // Read DBFile
    let dbFile = JSON.parse(await readFile(config.get("accounts.file")));

    // Check Exists
    let account = dbFile.accounts.find((account) => account.id === pId);
    if (!account) {
      res.send({ message: "Recurso não encontrado" }, 404);
    }

    // Update Resource
    const index = dbFile.accounts.findIndex((account) => account.id === pId);
    dbFile.accounts[index] = { id: account.id, ...pAccount };

    // Save DBFile
    await writeFile(config.get("accounts.file"), JSON.stringify(dbFile));

    // API Response
    account = dbFile.accounts.find((account) => account.id === pId);
    res.send(account, 200);
  } catch (error) {
    next(err);
  }
});

// PATCH
router.patch("/:id/balance", async (req, res, next) => {
  try {
    // URL Params
    const pId = parseInt(req.params.id);

    // Body Params
    const pAccount = req.body;

    // Read DBFile
    let dbFile = JSON.parse(await readFile(config.get("accounts.file")));

    // Check Exists
    let account = dbFile.accounts.find((account) => account.id === pId);
    if (!account) {
      res.send({ message: "Recurso não encontrado" }, 404);
    }

    // Update Resource
    const index = dbFile.accounts.findIndex((account) => account.id === pId);
    dbFile.accounts[index].balance = pAccount.balance;

    // Save DBFile
    await writeFile(config.get("accounts.file"), JSON.stringify(dbFile));

    // API Response
    account = dbFile.accounts.find((account) => account.id === pId);
    res.send(account, 200);
  } catch (error) {
    next(err);
  }
});

// DELETE ID
router.delete("/:id", async (req, res, next) => {
  try {
    // Params
    const id = parseInt(req.params.id);

    // Read DBFile
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
    next(err);
  }
});

router.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send({ error: err.message });
});

export default router;
