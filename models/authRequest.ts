import { Request } from "express";
import { User } from "./domain/user";

export interface AuthRequest extends Request{
    user?: User
}