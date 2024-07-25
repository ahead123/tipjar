import { Request, Response, Router } from 'express';
const router: Router = Router();
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../auth';

const prisma = new PrismaClient();

router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
    const user = await prisma.users.findUnique({
        where: {
            user_id: Number(id)
        }
    });
    res.json({ user, message: 'Protected route accessed!' });
    } catch (error) {
        res.json({ message: 'Error fetching user' });
    }
});

router.get('/all', authenticateToken, async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany();
        console.log('getting all users',users);
        res.json({ users, message: 'Protected route accessed!' });
    } catch (error) {
        console.log('error fetching users',error);
        res.json({ message: 'Error fetching users', error });
    }
});

router.get('/profile/:id', authenticateToken, async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
        where: {
            user_id: Number(id)
        }
    });
    res.json({ user, message: 'Protected route accessed!' });
});

export default router;