"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
exports.generateOtp = generateOtp;
