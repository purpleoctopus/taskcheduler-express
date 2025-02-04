import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Employee } from "./employee";
import { Task } from "./task";
import { ColorTheme } from "../dto/create-project.dto";

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    name!: string;

    @ManyToOne(() => Employee)
    owner!: Employee;

    @OneToMany(() => Task, task => task)
    tasks!: Task[];

    @ManyToMany(() => Employee, {nullable: true})
    @JoinTable()
    employees?: Employee[];

    @Column({
        type: 'int',
        nullable: true
    })
    colortheme?: ColorTheme
}