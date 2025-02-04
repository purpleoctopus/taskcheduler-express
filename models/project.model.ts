import { Employee } from "./employee.model";
import { Task } from "./task.model";

export enum ColorTheme{
    Purple = 1, Cyan = 2, Orange = 3
}

export interface Project{
    id: string,
    name: string,
    owner?: Employee,
    tasks: Task[],
    employees?: Employee[],
    colortheme?: ColorTheme
}