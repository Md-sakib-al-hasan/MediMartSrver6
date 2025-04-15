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
exports.EmailHelper = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const handlebars_1 = __importDefault(require("handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
const sendEmail = (email, html, subject, attachment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: config_1.default.NODE_ENV === 'production',
            auth: {
                user: config_1.default.sender_email,
                pass: config_1.default.sender_app_password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const mailOptions = {
            from: 'mdsakibalhasanprogrammer1@gmail.com',
            to: email,
            subject,
            html,
        };
        if (attachment) {
            mailOptions.attachments = [
                {
                    filename: attachment.filename,
                    content: attachment.content,
                    encoding: attachment.encoding,
                },
            ];
        }
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
});
const createEmailContent = (data, templateType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templatePath = path_1.default.join(process.cwd(), `/src/templates/${templateType}.template.hbs`);
        const content = yield readFileAsync(templatePath, 'utf8');
        const template = handlebars_1.default.compile(content);
        return template(data);
    }
    catch (error) {
        console.error('Error generating email content:', error);
        throw new Error('Failed to create email content');
    }
});
exports.EmailHelper = {
    sendEmail,
    createEmailContent,
};
