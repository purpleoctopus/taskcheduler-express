import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { User } from './models/domain/user';
import { AuthRequest } from './models/authRequest';

export const validateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {res.status(401).json({ message: "Unauthorized" });return}
  
    if(!process.env.JWT_SECRET) { res.status(500).json({message: 'Internal Server Error'}); throw new Error('No JWT Secret'); }

    jwt.verify(token, process.env.JWT_SECRET, (err:any, user:any) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user;
      next();
    });
  };


export const generateToken = (user: User) => {
    if(!process.env.JWT_SECRET) throw new Error('No JWT Secret')
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
};