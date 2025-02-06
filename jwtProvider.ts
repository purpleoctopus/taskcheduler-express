import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { User } from './models/domain/user';
import { AuthRequest } from './models/authRequest';
import { AppDataSource } from './db-source';

export const validateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {res.status(401).json({ error: "Unauthorized" });return}
  
    if(!process.env.JWT_SECRET) { res.status(500).json({error: 'Internal Server Error'}); throw new Error('No JWT Secret'); }

    jwt.verify(token, process.env.JWT_SECRET, async (err:any, user:any) => {
      if (err || !user) {res.status(403).json({ error: "Invalid token" }); return;}
      const userrepo = AppDataSource.getRepository(User)
      if(!await userrepo.findOne({where: {id:user.id}})) {res.status(403).json({error:'Token owner does not exist'});return;} 
      req.user = user;
      next();
    });
  };


export const generateToken = (user: User) => {
    if(!process.env.JWT_SECRET) throw new Error('No JWT Secret')
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
};