"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/', homeRoutes_1.default);
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running on http://localhost:${port}`);
});
