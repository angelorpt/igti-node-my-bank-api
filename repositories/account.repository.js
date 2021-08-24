import config from "config";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const getData = () => {
  const data = JSON.parse(await readFile(config.get("accounts.file")));
  return data;
};

const saveData = (data) => {
  await writeFile(config.get("accounts.file"), JSON.stringify(data));
};

const getAccounts = async () => {
  const data = getData();
  return data.accounts;
};

const getAccount = (id) => {
  const data = getData();
  const account = data.accounts.find((account) => account.id === id);
  return account;
};

const insertAccount = (pAccount) => {
  // Read DBFile
  const data = getData();

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
  saveData(data);
};

const deleteAccount = (id) => {
  // Read DBFile
  const data = getData();

  // Check exists
  let account = getAccount(id);
  if (!account) {
    return null;
  }

  // Removendo Recurso
  const dataNew = {
    nextId: data.nextId,
    accounts: data.accounts.filter((acc) => acc.id != id),
  };

  // Salvando os dados
  saveData(dataNew);

  // API Response
  return getAccount(id);
};

export default {
  getAccounts,
  getAccount,
  insertAccount,
  deleteAccount,
};
