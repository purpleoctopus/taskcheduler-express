import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Employee } from "./employee";


@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    name!: string;

    @Column('text',{nullable: true})
    desc?: string;

    @Column('date', {nullable: true})
    timeStart?: Date;

    @Column('int')
    deadline!: number;

    @ManyToOne(() => Employee, { nullable: true })
    executor?: Employee | null;
}