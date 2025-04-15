"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// Define routes
router.get('/', payment_controller_1.paymentController.getAll);
exports.default = router;
