import express from 'express';
import { router as projectRouter } from './routes/project.router';
import cors from 'cors'

const PORT = 9999;
const server = express();

server.use(express.json());
server.use(cors({
    origin: '*'
}))

server.use('/projects', projectRouter)

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})