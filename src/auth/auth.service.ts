import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { LoginDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly i18n: I18nService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user)
      throw new NotFoundException(await this.i18n.t('error.not_found'));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException(await this.i18n.t('error.unauthorized'));

    return user;
  }
}
