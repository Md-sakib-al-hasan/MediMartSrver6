"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const adminUser = {
    email: 'admin@ph.com',
    password: 'admin123',
    name: 'Admin',
    role: user_interface_1.UserRole.ADMIN,
};
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if an admin already exists
        const isAdminExist = yield user_model_1.default.findOne({ role: user_interface_1.UserRole.ADMIN });
        if (!isAdminExist) {
            yield user_model_1.default.create(adminUser);
            console.log('Admin user created successfully.');
        }
        else {
            console.log('Admin user already exists.');
        }
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
});
exports.default = seedAdmin;
