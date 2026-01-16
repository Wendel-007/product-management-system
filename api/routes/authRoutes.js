const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAuth, requireAdmin } = require("../middlewares/authMiddleware");

// POST /api/login - Login (público, não requer autenticação)
router.post("/", authController.login);

// GET /api/login/check - Check authentication (mantido para compatibilidade com frontend)
// Deve vir antes de /:username para não ser capturado como parâmetro
router.get("/check", authController.checkAuth);

// POST /api/login/logout - Logout (mantido para compatibilidade)
router.post("/logout", authController.logout);

// GET /api/login/all - Obtém todos os usuários (somente admin)
// Deve vir antes de /:username para não ser capturado como parâmetro
router.get("/all", requireAuth, requireAdmin, authController.getAllUsers);

// GET /api/login/ - Obtém dados do usuário atual (admin e user)
// Deve vir antes de /:username, mas depois de rotas específicas
router.get("/", requireAuth, authController.getCurrentUser);

// GET /api/login/:username - Obtém dados de um usuário específico (somente admin)
router.get("/:username", requireAuth, requireAdmin, authController.getUserByUsername);

// PUT /api/login/:username - Atualiza usuário (somente admin)
router.put("/:username", requireAuth, requireAdmin, authController.updateUser);

// DELETE /api/login/:username - Deleta usuário (somente admin)
router.delete("/:username", requireAuth, requireAdmin, authController.deleteUser);

module.exports = router;
