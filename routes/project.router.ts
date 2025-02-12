import { Router, Request, Response} from "express";
import { CreateProjectDTO } from "../models/dto/create-project.dto";
import { AppDataSource } from "../db-source";
import { Project } from "../models/domain/project";
import { validateToken } from "../jwtProvider";
import { AuthRequest } from "../models/authRequest";
import { User } from "../models/domain/user";

export const projectRouter = Router()

projectRouter.get('/', validateToken, async (req: AuthRequest, res: Response<Project[]>) => {
    const repo = AppDataSource.getRepository(Project);
    const user = await AppDataSource.getRepository(User).findOne({where: {id: req.user?.id}, relations: ['employee']})

    if(!user) {res.send([]); return;}

    const data = await repo.find({where:[
        {owner: {id: user.employee.id}},
        {employees: {id: user.employee.id}}
    ], relations: ['owner','employees']})
    res.send(data)
})

projectRouter.get('/all', validateToken, async (req: Request, res: Response<Project[]>) => {
    const repo = AppDataSource.getRepository(Project);
    const data = await repo.find({relations: ['owner']})
    res.send(data)
})

projectRouter.put('/leave/:id', validateToken, async (req: AuthRequest, res: Response)=>{
    const {id} = req.params;
    const projectRepo = AppDataSource.getRepository(Project);
    const project = await projectRepo.findOne({where:{id}, relations: ['employees']});
    const user = await AppDataSource.getRepository(User).findOne({where: {id: req.user?.id}, relations: ['employee']})
    
    if(!project || !project.employees) {res.status(404).json({error: 'Проект не знайдено'}); return;}

    const index = project.employees.findIndex((value)=>value.id == user?.employee.id)
    if(index === -1)  {res.status(404).json({error: 'Користувача не знайдено'}); return;}

    project.employees.splice(index, 1)
    
    await projectRepo.save(project)

    res.json({message: 'Успішно'})
})

projectRouter.get('/:id', validateToken, async (req: AuthRequest, res: Response) => {
    const {id} = req.params;
    const projectRepo = AppDataSource.getRepository(Project);
    const userRepo = AppDataSource.getRepository(User);

    const project = await projectRepo.findOne({where:{id}, relations: ['owner', 'employees']}); // 'tasks'
    const user = await userRepo.findOne({where: {id: req.user?.id}, relations: ['employee']});

    if(!project || !project.employees) {res.status(404).json({error: 'Проект не знайдено'}); return;}
    if(!user) {res.status(404).json({error: 'Користувача не знайдено'}); return;}

    if(project.owner.id == user.employee.id) {res.json({project, isOwner: true});return;}

    for(const employee of project.employees){
        if(employee.id == user.employee.id){
            res.json({project});
            return;
        }
    }

    res.status(401).json({error: 'No access.'});
})

projectRouter.delete('/:id', validateToken, async (req: AuthRequest, res: Response) => {
    const {id} = req.params
    const projectRepo = AppDataSource.getRepository(Project);
    const userRepo = AppDataSource.getRepository(User);

    const project = await projectRepo.findOne({where:{id}, relations: ['owner', 'employees']});
    const user = await userRepo.findOne({where: {id: req.user?.id}, relations: ['employee']});

    if(!project || !project.employees) {res.status(404).json({error: 'Проект не знайдено'}); return;}
    if(!user) {res.status(404).json({error: 'Користувача не знайдено'}); return;}

    if(project.owner.id == user.employee.id) {
        await projectRepo.delete(id);
        res.json(null);
        return;
    }

    res.status(401).json({error: 'No access.'});
})

projectRouter.post('/', validateToken, async (req: AuthRequest, res: Response) => {
    const dto = req.body as CreateProjectDTO;
    
        if (typeof dto.name === 'string' && dto.name.length >= 2) {
            const projectRepo = AppDataSource.getRepository(Project);
            const userRepo = AppDataSource.getRepository(User);


            if(!req.user) {res.status(400).json({ error: 'Bad request' }); return;}
            const user = await userRepo.findOne({where: {id: req.user.id}, relations: ['employee']})
            
            const project = projectRepo.create({name: dto.name, colortheme: dto.colortheme, employees: [], tasks: []})
            
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