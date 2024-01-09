import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCatDto } from "./dto/create-cat.dto";
import { UpdateCatDto } from "./dto/update-cat.dto";
import { Cat } from "./entities/cat.entity";
import { Breed } from "../breeds/entities/breed.entity";
import { ActiveUserInterface } from "src/common/interfaces/active-user.interface";
import { ActiveUser } from "src/common/decorators/active-user.decorator";
import { Role } from "src/common/enum/role.enum";

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) { }
  async create(createCatDto: CreateCatDto, user: ActiveUserInterface) {
    const breed = await this.breedsRepository.findOneBy({
      name: createCatDto.breed,
    });

    if (!breed) {
      throw new BadRequestException('Breed not found');
    }

    const cat = this.catsRepository.create({
      name: createCatDto.name,
      age: createCatDto.age,
      breed,
      userEmail: user.email
    });
    return await this.catsRepository.save(cat);
  }
  async findAll(@ActiveUser() user: ActiveUserInterface) {

    if (user.role === Role.Admin) {
      return await this.catsRepository.find();
    }
    return await this.catsRepository.find({ where: { userEmail: user.email } });
  }

  async findOne(id: number, @ActiveUser() user: ActiveUserInterface) {

    const cat = await this.catsRepository.findOneBy({ id })
    if (!cat) {
      throw new BadRequestException('Cat not found');
    }

    this.validateOwnership(cat, user);

    return cat;

  }

  async update(id: number, updateCatDto: UpdateCatDto, user: ActiveUserInterface) {
    await this.findOne(id, user);

    return await this.catsRepository.update({id}, {
      ...updateCatDto,
      breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
      userEmail: user.email,
    })
  }

  async remove(id: number, @ActiveUser() user: ActiveUserInterface) {
    await this.findOne(id, user);
    return await this.catsRepository.softDelete({ id });
  }

  private validateOwnership(cat: Cat, user: ActiveUserInterface) {
    if (cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }
  private async validateBreed(breed: string) {
    const breedEntity = await this.breedsRepository.findOneBy({ name: breed });

    if (!breedEntity) {
      throw new BadRequestException('Breed not found');
    }

    return breedEntity;
  }
}
