import { Router, Request, Response } from "express";
import { Employee } from "../models/domain/employee";
import { AppDataSource } from "../db-source";
import { CreateEmployeeDTO } from "../models/dto/create-employee.dto";

export const employeeRouter = Router()

employeeRouter.get('/', async (req: Request, res: Response<Employee[]>) => {
    const repo = AppDataSource.getRepository(Employee)
    const data = await repo.find()
    res.send(data)
})

employeeRouter.post('/', async (req: Request, res: Response) => {
    const dto = req.body as CreateEmployeeDTO;

    if (typeof dto.name === 'string' && typeof dto.position === 'string') {
        const repo = AppDataSource.getRepository(Employee);
        const employee = new Employee();
        employee.name = dto.name;
        employee.position = dto.position;
        await repo.save(employee);
        res.status(200).json(null);
    } else {
        res.status(400).json({ error: 'Invalid data format' });
    }
});