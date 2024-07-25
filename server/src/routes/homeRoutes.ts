import { Request, Response, Router } from 'express';
const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.send('Express + TypeScript Server 🚀');
});

export default router;