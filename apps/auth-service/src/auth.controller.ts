import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() body: LogoutDto) {
    return this.authService.logout(body);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  logoutAll(@Body() body: { userId: string }) {
    return this.authService.logoutAll(body.userId);
  }
}
