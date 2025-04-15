"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = require("express");
const meta_controller_1 = require("./meta.controller");
const router = (0, express_1.Router)();
router.get('/', 
// auth(UserRole.ADMIN),
meta_controller_1.MetaController.getMetaData);
exports.MetaRoutes = router;
