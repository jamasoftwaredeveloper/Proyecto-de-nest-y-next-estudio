import { Role } from "src/common/enum/role.enum";
import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity()
export class User {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.User })
    role: Role

    @DeleteDateColumn()
    deletedAt: Date

}
