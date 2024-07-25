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
router.get('/:id', authHelpers_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma.users.findUnique({
            where: {
                user_id: Number(id)
            }
        });
        res.json({ user, message: 'Protected route accessed!' });
    }
    catch (error) {
        res.json({ message: 'Error fetching user' });
    }
}));
router.get('/all', authHelpers_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany();
        console.log('getting all users', users);
        res.json({ users, message: 'Protected route accessed!' });
    }
    catch (error) {
        console.log('error fetching users', error);
        res.json({ message: 'Error fetching users', error });
    }
}));
router.get('/profile/:id', authHelpers_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.users.findUnique({
        where: {
            user_id: Number(id)
        }
    });
    res.json({ user, message: 'Protected route accessed!' });
}));
exports.default = router;
