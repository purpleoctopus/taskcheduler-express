import { Response, Router } from "express";
import { AuthRequest } from "../models/authRequest";
import { AppDataSource } from "../db-source";
import { validateToken } from "../jwtProvider";
import { Invite } from "../models/domain/invite";
import { User } from "../models/domain/user";
import { Project } from "../models/domain/project";
import { queue } from "../main";

export const inviteRouter = Router()

inviteRouter.get('/byToken', validateToken, async (req: AuthRequest, res: Response)=>{
    const repo = AppDataSource.getRepository(Invite);
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({where: {id: req.user?.id}, relations: ['employee']});

    if(!user) {res.status(404).json({error: 'Користувача не знайдено'}); return;}

    const invites = await repo.find({where: {recipient: user}, relations: ['sender', 'project']});
    res.status(200).json(invites);
    queue[`${req.user?.id}`] = false
})

inviteRouter.post('/byId', validateToken, async (req: AuthRequest, res: Response)=>{
    if(!req.body.userId || !req.body.projectId) {
        res.status(400).json({error:'Bad request'}); return;
    }

    const repo = AppDataSource.getRepository(Invite);
    const recipient = await AppDataSource.getRepository(User).findOne({where: {id: req.body.userId}});
    const sender = await AppDataSource.getRepository(User).findOne({where: {id: req.user?.id}});
    const project = await AppDataSource.getRepository(Project).findOne({where: {id: req.body.projectId}});

    if(!recipient || !project || !sender) {res.status(404).json({error: 'Щось пішло не так.'}); return;}

    const existingInvite = await repo.findOne({where: {recipient, project}});

    if(existingInvite) {res.status(400).json({error: 'Запрошення вже відправлено'}); return;}

    const invite = repo.create({sender, recipient, project});
    await repo.save(invite);
    res.status(200).json({message:'Запрошення відправлено успішно'})
    queue[`${recipient.id}`] = true
})


inviteRouter.put('/accept', validateToken, async (req: AuthRequest, res: Response) => {
    const { id } = req.body;

    const inviteRepo = AppDataSource.getRepository(Invite);
    const projectRepo = AppDataSource.getRepository(Project);
    const userRepo = AppDataSource.getRepository(User);

    const invite = await inviteRepo.findOne({ where: { id }, relations: ['project', 'recipient', 'project.employees'] });

    if (!invite) {
        res.status(404).json({ error: 'Запрошення не знайдено' });
        return;
    }

    const project = invite.project;
    if (!project) {
        res.status(404).json({ error: 'Проект не знайдено' });
        return;
    }

    if (!project.employees) {
        project.employees = [];
    }

    const user = await userRepo.findOne({ where: { id: invite.recipient.id }, relations: ['employee'] });

    if (!user) {
        res.status(404).json({ error: 'Користувача не знайдено' });
        return;
    }

    if (!project.employees.some(emp => emp.id === user.employee.id)) {
        project.employees.push(user.employee);
    }

    try {
        await projectRepo.save(project);
        await inviteRepo.delete(invite);
        res.json({ message: 'Прийнято' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка при збереженні проекту' });
    }
});

inviteRouter.put('/reject', validateToken, async (req: AuthRequest, res: Response)=>{
    const { id } = req.body;

    const inviteRepo = AppDataSource.getRepository(Invite);
    const invite = await inviteRepo.findOne({where:{id}})

    if(!invite) {res.status(404).json({error: 'Запрошення не знайдено'}); return;}

    await inviteRepo.delete(invite)
    res.json({message: 'Відмова'})
})