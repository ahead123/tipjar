import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate JWT
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' }); // Customize expiration as needed
};

// Middleware to verify JWT
export const authenticateToken = (req: Request, res: Response, next: any) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId; // Attach userId to request for further use
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};