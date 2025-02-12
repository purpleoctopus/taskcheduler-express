import { Router, Response } from "express";
import { validateToken } from "../jwtProvider";
import { AuthRequest } from "../models/authRequest";
import { queue } from "../main";

export const notificationRouter = Router()

notificationRouter.get('/', validateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    if (queue[userId]) { 
        res.json({ message: true });
        return;
    }

    res.json({message:false});
})