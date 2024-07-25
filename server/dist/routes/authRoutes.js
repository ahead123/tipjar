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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const client_1 = require("@prisma/client");
const authHelpers_1 = require("../utils/authHelpers");
const prisma = new client_1.PrismaClient();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, first_name, last_name, email, role } = req.body;
    if (!username || !password || !first_name || !last_name || !email || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    ;
    const existingUser = yield prisma.users.findUnique({
        where: {
            email
        }
    });
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }
    ;
    let hashedPassword = yield (0, authHelpers_1.hashPassword)(password);
    const user = yield prisma.users.create({
        data: {
            username,
            password: hashedPassword,
            first_name,
            last_name,
            email,
            role
        }
    });
    res.json({ user, message: 'User created!' });
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    ;
    const user = yield prisma.users.findUnique({
        where: {
            username
        }
    });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    ;
    yield (0, authHelpers_1.comparePassword)(password, user.password);
    if (!authHelpers_1.comparePassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = (0, authHelpers_1.generateToken)(user.email);
    res.json({ token });
}));
exports.default = router;
