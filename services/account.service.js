import { promises as fs } from "fs";
import config from "config";

const { readFile, writeFile } = fs;

const getAccounts = async () => {
  // Read DBFile
  const dbFile = JSON.parse(await readFile(config.get("accounts.file")));
  return dbFile.accounts;
};

const getAccount = async (id) => {
  // Read DBFile
  const dbFile = JSON.parse(await readFile(config.get("accounts.file")));

  // Find Resource
  const account = dbFile.accounts.find((account) => account.id === id);

  return account;
};

const createAccount = async (pAccount) => {
  // Read DBFile
  const dbFile = await readFile(config.get("accounts.file"));
  let data = JSON.parse(dbFile);

  // New Account
  let account = {
    id: data.nextId,
    name: pAccount.name,
    balance: pAccount.balance,
  };

  // Update Object DBFile
  data.nextId++;
  data.accounts.push(account);

  // Save DBFile
  await writeFile(config.get("accounts.file"), JSON.stringify(data));

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
  // Read DBFile
  const dbFile = JSON.parse(await readFile(config.get("accounts.file")));

  // Check exists
  let account = dbFile.accounts.find((account) => account.id === id);
  if (!account) {
    return null;
  }

  // Removendo Recurso
  const data = {
    nextId: dbFile.nextId,
    accounts: dbFile.accounts.filter((acc) => acc.id != id),
  };

  // Salvando os dados
  await writeFile(config.get("accounts.file"), JSON.stringify(data));

  // API Response
  account = dbFile.accounts.find((account) => account.id === id);
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
