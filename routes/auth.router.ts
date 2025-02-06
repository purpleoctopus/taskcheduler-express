import { Router, Request, Response} from "express";
import { AppDataSource } from "../db-source";
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
    if (existingUser) {res.status(400).json({ error: "Користувач з таким нікнеймом уже існує" }); return;}

    try{
        const userrepo = AppDataSource.getRepository(User)

        const user = userrepo.create({id: uuidv4(), username, email, password: hashedPassword, employee: {name, position}})

        await userrepo.save(user)

        res.status(200).json({message: 'Користувача зареєстровано '})
    }catch(er){
      res.status(500).json({error: 'Помилка при реєстрації '})
    }
})

authRouter.post('/login', async (req: Request, res: Response)=>{
  const { username, password } = req.body as LoginDto;
  const user = await AppDataSource.getRepository(User).findOne({ where: { username }, relations: ['employee'] });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400).json({ error: "Неправильні дані" }); return;
  }

  const token = generateToken(user);
  res.status(200).json({ token: token });
})