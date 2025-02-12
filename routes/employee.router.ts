import { Router, Request, Response } from "express";
import { Employee } from "../models/domain/employee";
import { AppDataSource } from "../db-source";
import { validateToken } from "../jwtProvider";
import { Project } from "../models/domain/project";
import { Invite } from "../models/domain/invite";

export const employeeRouter = Router()

employeeRouter.get('/', validateToken, async (req: Request, res: Response<Employee[]>) => {
    const repo = AppDataSource.getRepository(Employee)
    const data = await repo.find()
    res.send(data)
})

/*employeeRouter.get('/byToken', validateToken, async (req: AuthRequest, res: Response<Employee[]>) => {
    const repo = AppDataSource.getRepository(Employee)
    const data = await repo.find({where: {id: req.user?.employee.}})
    res.send(data)
})*/