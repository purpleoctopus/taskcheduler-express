import { Router, Request, Response } from "express";
import { Employee } from "../models/domain/employee";
import { AppDataSource } from "../db-source";
import { CreateEmployeeDTO } from "../models/dto/create-employee.dto";
import { validateToken } from "../jwtProvider";

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