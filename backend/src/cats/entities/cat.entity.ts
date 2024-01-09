import { User } from "../../users/entities/user.entity";
import { Breed } from "../../breeds/entities/breed.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Cat {
  @Column({primary:true, generated:true})
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  //opción 1
  @ManyToOne(() => Breed, (breed) => breed.id, {
    // cascade: true,
    eager: true, // para que traiga las raza al hacer un findOne
  })
  breed: Breed;
  
  //opción 2
  @ManyToOne(()=>User)
  @JoinColumn({name:'userEmail', referencedColumnName:'email'})
  user: User;
 
  @Column()
  userEmail: string;

  @DeleteDateColumn()
  deletedAt: Date;
}
