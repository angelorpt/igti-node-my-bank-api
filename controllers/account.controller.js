import { promises as fs } from "fs";
import config from "config";
import AccountService from "../services/account.service.js";

const { readFile, writeFile } = fs;

// GET ALL
const getAccounts = async (req, res, next) => {
  try {
    const accounts = await AccountService.getAccounts();

    // API Response
    res.status(200).send(accounts);
    logger.info("GET /accounts");
  } catch (error) {
    next(error);
  }
};

// GET ACCOUNT
const getAccount = async (req, res, next) => {
  try {
    // Params
    const id = parseInt(req.params.id);

    // Service
    const account = await AccountService.getAccount(id);

    // IF Not Exists
    if (!account) {
      res.status(404).send({ message: "Não encontrado" });
    }

    // API Response
    res.status(200).send(account);

    // Log
    logger.info("GET /accounts/:id");
  } catch (error) {
    next(error);
  }
};

// CREATE
const createAccount = async (req, res, next) => {
  try {
    // Body Params
    const pAccount = req.body;

    // Validando Fields do Body
    if (!pAccount.name || pAccount.balance == null) {
      throw new Error("Name e Balance são obrigatórios");
    }

    // Service
    const account = await AccountService.createAccount(pAccount);

    // API Response
    res.status(201).send(account);

    logger.info(`POST /account ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateAccount = async (req, res, next) => {
  try {
    // URL Params
    const pId = parseInt(req.params.id);

    // Body Params
    const pAccount = req.body;

    // Validando Fields do Body
    if (!pAccount.name || pAccount.balance == null) {
      throw new Error("Name e Balance são obrigatórios");
    }

    // Service
    const account = await AccountService.updateAccount(pId, pAccount);
    if (!account) {
      res.status(404).send({ message: "Recurso não encontrado" });
    }

    // API Response
    res.status(200).send(account);

    logger.info(`PUT /accounts/:id - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
};

// UPDATE BALANCE
const updateBalance = async (req, res, next) => {
  try {
    // URL Params
    const pId = parseInt(req.params.id);

    // Body Params
    const pAccount = req.body;

    // Validando Fields do Body
    if (pAccount.balance == null) {
      throw new Error("Balance é obrigatório");
    }

    // Service
    const account = await AccountService.updateBalance(pId, pAccount);
    if (!account) {
      res.status(404).send({ message: "Recurso não encontrado" });
    }

    // API Response
    res.status(200).send(account);

    // Log
    logger.info(
      "PUT /accounts/:id/balance",
      `old: ${account.balance} | new: ${pAccount.balance}`
    );
  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteAccount = async (req, res, next) => {
  try {
    // Params
    const id = parseInt(req.params.id);

    // Service
    const account = await AccountService.deleteAccount(id);

    if (!account) {
      res.status(404).send({ message: "Recurso não encontrado" });
    }

    // Retorno API
    res.status(200).send({ message: "Recurso deletado" });

    // Log
    logger.info(`DELETE /accounts/${id}`);
  } catch (error) {
    next(error);
  }
};

export default {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount,
  updateBalance,
};
