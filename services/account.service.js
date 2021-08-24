import { promises as fs } from "fs";
import config from "config";
import AccountRepository from "../services/account.service.js";

const { readFile, writeFile } = fs;

const getAccounts = async () => {
  const accounts = await AccountRepository.getAccounts();
  return accounts;
};

const getAccount = async (id) => {
  const account = await AccountRepository.getAccount(id);
  return account;
};

const createAccount = async (pAccount) => {
  const account = await AccountRepository.insertAccount(pAccount);
  return account;
};

const updateAccount = async (pId, pAccount) => {
  // Read DBFile
  let dbFile = JSON.parse(await readFile(config.get("accounts.file")));

  // Check Exists
  const index = dbFile.accounts.findIndex((account) => account.id === pId);
  if (index === -1) {
    return null;
  }

  // Update Resource
  dbFile.accounts[index] = {
    id: pId,
    name: pAccount.name,
    balance: pAccount.balance,
  };

  // Save DBFile
  await writeFile(config.get("accounts.file"), JSON.stringify(dbFile));

  // API Response
  let account = dbFile.accounts.find((account) => account.id === pId);
  return account;
};

const updateBalance = async (pId, pAccount) => {
  // Read DBFile
  let dbFile = JSON.parse(await readFile(config.get("accounts.file")));

  // Check Exists
  let account = dbFile.accounts.find((account) => account.id === pId);
  if (!account) {
    return null;
  }

  // Update Resource
  const index = dbFile.accounts.findIndex((account) => account.id === pId);
  dbFile.accounts[index].balance = pAccount.balance;

  // Save DBFile
  await writeFile(config.get("accounts.file"), JSON.stringify(dbFile));

  // API Response
  account = dbFile.accounts.find((account) => account.id === pId);
  return account;
};

const deleteAccount = async (id) => {
  return account;
};

export default {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  updateBalance,
  deleteAccount,
};
