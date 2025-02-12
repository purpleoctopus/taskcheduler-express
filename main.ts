import express from 'express';
import { projectRouter as projectRouter } from './routes/project.router';
import {  employeeRouter as employeeRouter } from './routes/employee.router';
import cors from 'cors'
import { AppDataSource } from './db-source';
import dotenv from 'dotenv'
import { authRouter } from './routes/auth.router';
import { userRouter } from './routes/user.router';
import { inviteRouter } from './routes/invite.router';
import { notificationRouter } from './routes/notification.router';

dotenv.config()
const PORT = 9999;
const app = express();

export const queue:Record<string, boolean>= {}

app.use(express.json());
app.use(cors({
    origin: '*'
}))
app.use('/projects', projectRouter)
app.use('/employees', employeeRouter)
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/invites', inviteRouter)
app.use('/notifications', notificationRouter)

AppDataSource.initialize()

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})