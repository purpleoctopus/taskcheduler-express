import { Router, Request, Response} from "express";
import { CreateProjectDTO } from "../models/dto/create-project.dto";
import { AppDataSource } from "../db-source";
import { Project } from "../models/domain/project";
import { validateToken } from "../jwtProvider";
import { AuthRequest } from "../models/authRequest";
import { User } from "../models/domain/user";

export const projectRouter = Router()

projectRouter.get('/', validateToken, async (req: Request, res: Response<Project[]>) => {
    const repo = AppDataSource.getRepository(Project);
    const data = await repo.find({relations: ['owner']})
    res.send(data)
})

projectRouter.post('/', validateToken, async (req: AuthRequest, res: Response) => {
    const dto = req.body as CreateProjectDTO;
    
        if (typeof dto.name === 'string' && dto.name.length >= 2) {
            const projectRepo = AppDataSource.getRepository(Project);
            const userRepo = AppDataSource.getRepository(User);


            if(!req.user) {res.status(400).json({ error: 'Bad request' }); return;}
            const user = await userRepo.findOne({where: {id: req.user.id}, relations: ['employee']})
            
            const project = projectRepo.create({name: dto.name, colortheme: dto.colortheme})
            
            if(user) project.owner = user.employee
            else{
                res.status(404).json({ error: 'Employee does not exist' })
                return
            }
            await projectRepo.save(project);
            res.status(200).json(null);
        } else {
            res.status(400).json({ error: 'Invalid data format' });
        }
})