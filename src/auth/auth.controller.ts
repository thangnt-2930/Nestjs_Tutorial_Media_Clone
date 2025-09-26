import { Controller, Post, Body } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 201, description: 'Login successfully' })
  @ApiResponse({ status: 401, description: 'Email or password is incorrect' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
