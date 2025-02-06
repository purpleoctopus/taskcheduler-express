import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Employee } from "./employee";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text', {unique: true})
    username!: string;

    @Column('text')
    password!: string;

    @Column('text')
    email!: string;

    @OneToOne(() => Employee, (employee)=>employee.user, {nullable: false, cascade: true})
    @JoinColumn()
    employee!: Employee;
}