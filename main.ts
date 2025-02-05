import express from 'express';
import { projectRouter as projectRouter } from './routes/project.router';
import {  employeeRouter as employeeRouter } from './routes/employee.router';
import cors from 'cors'
import { AppDataSource } from './db-source';
import { Employee } from './models/domain/employee';
import dotenv from 'dotenv'
import { authRouter } from './routes/auth.router';

dotenv.config()
const PORT = 9999;
const server = express();

server.use(express.json());
server.use(cors({
    origin: '*'
}))
server.use('/projects', projectRouter)
server.use('/employees', employeeRouter)
server.use('/auth', authRouter)

async function createTestEmployee(){
    if((await AppDataSource.getRepository(Employee).find()).length == 0){
        const employee = new Employee();
        employee.id = '2deb7cb0-55d0-423e-b193-a45d1546d708';
        employee.name = 'Денис';
        employee.position = 'Senior Ionic Engineer';

        await AppDataSource.getRepository(Employee).save(employee)
    }
}

AppDataSource.initialize().then(()=>createTestEmployee())

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})