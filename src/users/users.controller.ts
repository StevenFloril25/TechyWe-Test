import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('my-profile')
  async getProfile(@Req() req: any) {
    // req.user viene de JwtStrategy.validate
    const { userId, email } = req.user;
    return { id: userId, email };
  }

  @Put('my-profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const updated = await this.users.updateProfile(req.user.userId, dto);
    return { id: updated.id, email: updated.email };
  }
}
