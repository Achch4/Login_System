import express from "express";
import { login, register } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard', { username: req.user.username });
});

export default router;
