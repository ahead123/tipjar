import { Request, Response, Router } from 'express';
const router: Router = Router();
import { PrismaClient } from '@prisma/client';
import { generateToken, authenticateToken } from '../auth';

const prisma = new PrismaClient();

router.post('/register', async (req: Request, res: Response) => {
    const { username, password, first_name, last_name, email, role } = req.body;

    if (!username || !password || !first_name || !last_name || !email || !role) {
        return res.status(400).json({ message: 'All fields are required' })
    };

    const existingUser = await prisma.users.findUnique({
        where: {
            email
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


router.post('/login', async (req: Request, res: Response) => {
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

export default router;
