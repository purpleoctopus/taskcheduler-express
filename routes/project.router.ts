import { Router, Request, Response} from "express";
import { Project } from "../models/project.model";

export const router = Router()

const data: Project[]=[
    {id: '0', name: 'MyApp', tasks: [], owner: {id: '', name: 'Den', position: 'Java Senior'}, colortheme: 1},
    {id: '1', name: 'Creatio', tasks: [], owner: {id: '', name: 'Petro', position: 'Devops Middle'}, colortheme: 3},
    {id: '1', name: 'Telegram', tasks: [], owner: {id: '', name: 'Pavlo', position: 'C++ Junior'}, colortheme: 2}
]

router.get('/', (req: Request, res: Response<Project[]>) => {
    res.send(data)
})

router.post('/', (req: Request<Project>, res: Response) => {
    data.push(req.body);
    res.status(200).json(null)
})