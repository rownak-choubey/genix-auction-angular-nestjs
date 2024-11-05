import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseModel } from '../common/models/response.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: { username: string, email: string, password: string }): Promise<UserResponseModel> {
    return this.authService.register(user.username, user.email, user.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: { email: string, password: string }): Promise<UserResponseModel> {
    return this.authService.login(credentials.email, credentials.password);
  }
}
