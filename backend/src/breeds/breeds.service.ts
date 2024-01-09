import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>,
  ) { }

  async create(createBreedDto: CreateBreedDto) {
    const breed = this.breedsRepository.create(createBreedDto);
    return await this.breedsRepository.save(breed);
  }

  async findAll() {
    return await this.breedsRepository.find();
  }

  async findOne(id: number) {
    return await this.breedsRepository.findOneBy({ id });
  }

  async update(id: number, updateCatDto: UpdateBreedDto) {
    return await this.breedsRepository.update(id, updateCatDto);

  }
  async remove(id: number) {
    return await this.breedsRepository.softDelete(id);
  }
}