import { Role } from "src/common/enum/role.enum";
import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity()
export class Session {
    @Column({ primary: true, generated: true })
    id: number;

    @Column()
    origin: string;

    @Column()
    method: string;

    @Column()
    ip:string;
}
