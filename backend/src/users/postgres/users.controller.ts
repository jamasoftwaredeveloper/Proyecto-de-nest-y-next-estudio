import { Controller, Get, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from 'src/common/enum/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('postgres-users')
// @ApiBearerAuth()
// @Auth(Role.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  @Get()
  async findAll(): Promise<any> {
    const key = "users";
    const usersCache = await this.cacheManager.get(key);

    if (usersCache) {
      console.log('usersCache',usersCache);
      return usersCache;
    }
    const users = await this.usersService.findAll();

    console.log('users',users);
    await this.cacheManager.set(key, users, 100000 *10); // ? Retrieve data from the cache
    return users;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
