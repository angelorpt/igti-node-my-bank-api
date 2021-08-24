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

const updateAccount = (pId, pAccount) => {
  // Read DBFile
  let dbFile = JSON.parse(await readFile(config.get("accounts.file")));

  // Check Exists
  const index = dbFile.accounts.findIndex((account) => account.id === pId);
  if (index === -1) {
    res.status(404).send({ message: "Recurso não encontrado" });
  }

  // Update Resource
  dbFile.accounts[index] = {
    id: pId,
    name: pAccount.name,
    balance: pAccount.balance,
  };

  // Save DBFile
  await writeFile(config.get("accounts.file"), JSON.stringify(dbFile));

  const account = dbFile.accounts.find((account) => account.id === pId);
};

export default {
  createAccount,
  getAccounts,
  getAccount,
};
