import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    name!: string;

    @Column('text')
    position!: string;

    @OneToOne(()=>User, (user)=>user.employee)
    user!: User
}