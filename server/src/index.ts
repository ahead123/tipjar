import dotenv from 'dotenv';
dotenv.config();
import express , { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import { generateToken, authenticateToken } from './auth';

const prisma = new PrismaClient();

const app: Express = express();
const port: string | number = process.env.PORT || 5000;


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    res.send('Express + TypeScript Server 🚀');
});


app.post('/login', async (req: Request, res: Response) => {
    console.log(req.body);
    const { username, password } = req.body;
    const user = await prisma.users.findUnique({
        where: {
            username,
            password
        }
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
        return res.status(403).json({ message: 'Invalid password' });
    }

    const token = generateToken(user.email);
    res.json({ token });
});

app.listen(port, () => {
    console.log(`[server]: Server is running on http://localhost:${port}`);
});