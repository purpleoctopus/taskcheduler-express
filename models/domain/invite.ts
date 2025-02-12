import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { Project } from "./project";

@Entity()
export class Invite {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(()=>User)
    sender!: User;

    @ManyToOne(() => User)
    recipient!: User;

    @ManyToOne(() => Project)
    project!: Project;
}