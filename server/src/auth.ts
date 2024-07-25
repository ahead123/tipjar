import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

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

// Function to hash password
export const hashPassword = async (password: string) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      throw err;
    }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        throw err;
      }
      return hash.toString();
    });
  });
};

// Function to compare password
export const comparePassword = async (password: string, hash: string) => {
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      throw err;
    }
    if (result === true) {
      return true;
    }else {
      return false;
    }
  });
}