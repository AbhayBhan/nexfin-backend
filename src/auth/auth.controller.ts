import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService : AuthService) {}

  @Post('/register')
  @HttpCode(201)
  register(@Body(ValidationPipe) createUserDto : CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body(ValidationPipe) loginUserDto : LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }
}
