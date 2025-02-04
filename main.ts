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

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})