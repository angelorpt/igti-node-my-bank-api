import express from "express";
import AccountController from "../controllers/account.controller.js";

const router = express.Router();

// router.get("/", cors(), async (req, res, next) => {s
router.get("/", AccountController.getAccounts);
router.get("/:id", AccountController.getAccount);
router.post("/", AccountController.createAccount);
router.put("/:id", AccountController.updateAccount);
router.patch("/:id/balance", AccountController.updateBalance);
router.delete("/:id", AccountController.deleteAccount);

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
