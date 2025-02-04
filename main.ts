import express from 'express';
import { router as projectRouter } from './routes/project.router';
import {  router as employeeRouter } from './routes/employee.router';
import cors from 'cors'
import { AppDataSource } from './db-source';
import { Employee } from './models/domain/employee';

const PORT = 9999;
const server = express();

server.use(express.json());
server.use(cors({
    origin: '*'
}))
server.use('/projects', projectRouter)
server.use('/employees', employeeRouter)


AppDataSource.initialize()
async function createTestEmployee(){
    if((await AppDataSource.getRepository(Employee).find()).length == 0){
        const employee = new Employee();
        employee.id = '2deb7cb0-55d0-423e-b193-a45d1546d708';
        employee.name = 'Денис';
        employee.position = 'Senior Ionic Engineer';

        await AppDataSource.getRepository(Employee).save(employee)
    }
}
createTestEmployee()

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})