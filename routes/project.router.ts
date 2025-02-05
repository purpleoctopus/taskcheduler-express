import { Router, Request, Response} from "express";
import { CreateProjectDTO } from "../models/dto/create-project.dto";
import { AppDataSource } from "../db-source";
import { Project } from "../models/domain/project";
import { Employee } from "../models/domain/employee";
import { validateToken } from "../jwtProvider";

export const projectRouter = Router()

projectRouter.get('/', validateToken, async (req: Request, res: Response<Project[]>) => {
    const repo = AppDataSource.getRepository(Project);
    const data = await repo.find({relations: ['owner']})
    res.send(data)
})

projectRouter.post('/', validateToken, async (req: Request, res: Response) => {
    const dto = req.body as CreateProjectDTO;
    
        if (typeof dto.name === 'string' && typeof dto.ownerId === 'string') {
            const projectRepo = AppDataSource.getRepository(Project);
            const employeeRepo = AppDataSource.getRepository(Employee);

            const employee = await employeeRepo.findOne({where: {id: dto.ownerId}})
            
            const project = new Project();
            project.name = dto.name;
            project.colortheme = dto.colortheme

            if(employee) project.owner = employee
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