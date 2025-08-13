import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private users: UsersService) {}

  async register(email: string, password: string) {
    const user = await this.users.register(email, password);
    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.users.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'super_secret_change_me',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
    return { access_token };
  }
}
