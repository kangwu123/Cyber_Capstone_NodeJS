import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-respone.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Auth') // Tạo group API
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login user' }) // Tạo mô tả API
  @ApiResponse({ status: 201, description: 'Login user account success', type: RegisterResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);
    return new LoginResponseDto(result as LoginResponseDto);
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Create new user account' }) // Tạo mô tả API
  @ApiResponse({ status: 201, description: 'Create new user account success', type: RegisterResponseDto })
  async register(@Body() body: RegisterRequestDto): Promise<RegisterResponseDto> {
    const user = await this.authService.register(body);
    return new RegisterResponseDto(user as RegisterResponseDto);
  }
}
