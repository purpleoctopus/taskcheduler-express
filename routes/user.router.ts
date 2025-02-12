import { Response, Router } from "express";
import { AuthRequest } from "../models/authRequest";
import { AppDataSource } from "../db-source";
import { User } from "../models/domain/user";
import { validateToken } from "../jwtProvider";
import { Project } from "../models/domain/project";
import { Invite } from "../models/domain/invite";

export const userRouter = Router()

userRouter.get('/', validateToken, async (req: AuthRequest, res: Response<User[]>) => {
    const repo = AppDataSource.getRepository(User)
    const data = await repo.find({relations: ['employee']}) as any[]
    data.forEach(user => user.password = undefined)
    res.send(data)
})

userRouter.get('/forProject/:projectId', validateToken, async(req: AuthRequest, res: Response<User[] | Record<string,string>>)=>{
    const projectId = req.params.projectId

    const users = await AppDataSource.getRepository(User).find({relations: ['employee']})
    const project = await AppDataSource.getRepository(Project)
        .findOne({where: {id: projectId}, relations: ['owner', 'employees']});
    const invites = await AppDataSource.getRepository(Invite).find({relations: ['recipient']})

    if(!project) {res.status(404).json({error: '404 не знайдено'}); return;}

    const response = users.filter((value) =>
        !invites.some(invite => invite.recipient.id === value.id)&&
        !project.employees?.some(employee=>employee.id === value.employee.id)&&
        project.owner.id !== value.employee.id
    )

    res.send(response)
})

userRouter.get('/byToken', validateToken, async (req: AuthRequest, res: Response)=>{
    const repo = AppDataSource.getRepository(User)
    const user = await repo.findOne({where: {id: req.user?.id}, relations: ['employee']}) as any
    user.password = undefined
    res.status(200).json(user)
})

userRouter.delete('/byToken', validateToken, async (req:AuthRequest, res: Response)=>{
    const repo = AppDataSource.getRepository(User)
    if(req.user){
        const user = await repo.findOne({where: {id: req.user.id}, relations: ['employee']});
        if(!user) {res.status(404).json({error: 'User not found'}); return;}
        repo.remove(user)
        res.status(200).json({message: 'User deleted'})
    }
    else{
        res.status(400).json({error: 'Something went wrong'})
    }
})