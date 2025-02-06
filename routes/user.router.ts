import { Response, Router } from "express";
import { AuthRequest } from "../models/authRequest";
import { AppDataSource } from "../db-source";
import { User } from "../models/domain/user";
import { validateToken } from "../jwtProvider";

export const userRouter = Router()

userRouter.get('/byToken', validateToken, async (req: AuthRequest, res: Response)=>{
    const repo = AppDataSource.getRepository(User)
    const user = await repo.findOne({where: {id: req.user?.id}, relations: ['employee']}) as any
    user.password = undefined
    res.status(200).json(user)
})

userRouter.delete('/byToken', validateToken, async (req:AuthRequest, res: Response)=>{
    const repo = AppDataSource.getRepository(User)
    if(req.user){
        repo.delete(req.user.id)
        res.status(200).json({message: 'User deleted'})
    }
    else{
        res.status(400).json({error: 'Something went wrong'})
    }
})