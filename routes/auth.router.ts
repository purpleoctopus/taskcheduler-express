import { Router, Request, Response} from "express";
import { AppDataSource } from "../db-source";
import { Employee } from "../models/domain/employee";
import { RegisterDTO } from "../models/dto/register.dto";
import { User } from "../models/domain/user";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../jwtProvider";
import { LoginDto } from "../models/dto/login.dto";
import bcrypt from 'bcrypt'

export const authRouter = Router()

authRouter.post('/register', async (req: Request, res: Response) => {
    const request = req.body as RegisterDTO

    const {username, email, password} = request
    const {name, position} = request.employee
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await AppDataSource.getRepository(User).findOne({ where: { username } });
    if (existingUser) {res.status(400).json({ message: "User already exists" }); return;}

    try{
        const employeerepo = AppDataSource.getRepository(Employee)
        const userrepo = AppDataSource.getRepository(User)

        const employee = employeerepo.create({id: uuidv4(), name, position})
        const user = userrepo.create({id: uuidv4(), username, email, password: hashedPassword, employee})

        await employeerepo.save(employee)
        await userrepo.save(user)

        res.status(200).json({message: 'User registered'})
    }catch(er){
        res.status(400).json({message: 'Error while registering: '})
    }
})

authRouter.post('/login', async (req: Request, res: Response)=>{
  const { username, password } = req.body as LoginDto;
  const user = await AppDataSource.getRepository(User).findOne({ where: { username }, relations: ['employee'] });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400).json({ message: "Invalid credentials" }); return;
  }

  const token = generateToken(user);
  res.status(200).json({ token: token, id: user.employee.id });
})