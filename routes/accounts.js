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
    logger.info("GET /accounts");
  } catch (error) {
    next(error);
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

    // Log
    logger.info("GET /accounts/:id");
  } catch (error) {
    next(error);
  }
});

// POST
router.post("/", async (req, res, next) => {
  try {
    // Body Params
    const pAccount = req.body;

    // Read DBFile
    const dbFile = await readFile(config.get("accounts.file"));
    let data = JSON.parse(dbFile);

    // New Account
    let account = { id: data.nextId, ...pAccount };

    // Update Object DBFile
    data.nextId++;
    data.accounts.push(account);

    // Save DBFile
    await writeFile(config.get("accounts.file"), JSON.stringify(data));

    // API Response
    res.send(account, 201);

    logger.info(`POST /account ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
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

    logger.info(`PUT /accounts/:id - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
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

    logger.info(
      "PUT /accounts/:id/balance",
      `old: ${account.balance} | new: ${pAccount.balance}`
    );
  } catch (error) {
    next(error);
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

    // Log
    logger.info(`DELETE /accounts/${id}`);
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
