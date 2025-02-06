import express from 'express';
import { projectRouter as projectRouter } from './routes/project.router';
import {  employeeRouter as employeeRouter } from './routes/employee.router';
import cors from 'cors'
import { AppDataSource } from './db-source';
import dotenv from 'dotenv'
import { authRouter } from './routes/auth.router';
import { userRouter } from './routes/user.router';

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
server.use('/users', userRouter)

AppDataSource.initialize()

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})