import { Request, Response, Router } from 'express';
const router: Router = Router();
import { PrismaClient } from '@prisma/client';
import { generateToken, authenticateToken, hashPassword, comparePassword } from '../auth';

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

    let hashedPassword = await hashPassword(password);

    const user = await prisma.users.create({
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
});


router.post('/login', async (req: Request, res: Response) => {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    };

   const user = await prisma.users.findUnique({
         where: {
              username
         }
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    };

    await comparePassword(password, user.password);

    if(!comparePassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user.email);
    res.json({ token });
});

export default router;
