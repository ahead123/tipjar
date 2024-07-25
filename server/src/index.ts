import dotenv from 'dotenv';
dotenv.config();
import express , { Express, Request, Response } from 'express';
const app: Express = express();
const port: string | number = process.env.PORT || 5000;

import homeRoutes from './routes/homeRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`[server]: Server is running on http://localhost:${port}`);
});