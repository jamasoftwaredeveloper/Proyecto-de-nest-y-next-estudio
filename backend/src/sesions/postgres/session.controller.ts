import { Controller, Body, Patch, Param, Post} from '@nestjs/common';
import { Role } from 'src/common/enum/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateSessionDto } from '../dto/create-session.dto';
import { SessionService } from './session.service';
import { UpdateSessionDto } from '../dto/update-session.dto';


@ApiTags('postgres-users')
@ApiBearerAuth()
@Auth(Role.Admin)
@Controller('users')
export class SessionController {
  constructor(private readonly usersService: SessionService) { }

  @Post()
  Create(@Body() createSessionDto: CreateSessionDto) {
    return this.usersService.create(createSessionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.usersService.update(+id, updateSessionDto);
  }


}
