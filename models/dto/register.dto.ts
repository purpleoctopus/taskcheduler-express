import { Employee } from "../domain/employee";
import { CreateEmployeeDTO } from "./create-employee.dto";

export interface RegisterDTO{
    username: string,
    email: string,
    password: string,
    employee: CreateEmployeeDTO
}