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

app.post('/register', async (req: Request, res: Response) => {
    const { username, password, first_name, last_name, email, role } = req.body;

    if (!username || !password || !first_name || !last_name || !email || !role) {
        return res.status(400).json({ message: 'All fields are required' })
    };

    const existingUser = await prisma.users.findUnique({
        where: {
            username
        }
    });

    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    };

    const user = await prisma.users.create({
        data: {
            username,
            password,
            first_name,
            last_name,
            email,
            role
        }
    });

    res.json({ user, message: 'User created!' });
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

// Protected route
app.get('/users', authenticateToken, async (req: Request, res: Response) => {
    const users = await prisma.users.findMany();
    res.json({ users, message: 'Protected route accessed!' });
});

// Protected route
app.get('/profile', authenticateToken, async (req: Request, res: Response) => {
    res.json({ userId: req.userId, message: 'Protected route accessed!' });
});

app.listen(port, () => {
    console.log(`[server]: Server is running on http://localhost:${port}`);
});