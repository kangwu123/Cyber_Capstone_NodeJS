import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from '../../modules-system/token/token.service';
import { LoginDto } from './dto/login-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private tokenService: TokenService,) { }
    async login(body: LoginDto) {
        const { email, password } = body;
        console.log(email, password);
        const userExists = await this.prisma.users.findUnique({ where: { email } });
        if (!userExists) {
            throw new BadRequestException('User not found');
        }
        const isPasswordValid = bcrypt.compareSync(password, userExists.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password');
        }

        const { tokens } = this.tokenService.createTokens(userExists.id, userExists.role);
        return { ...userExists, tokens };
    }


    async register(body: RegisterRequestDto) {
        console.log(body);
        const { email, password } = body;
        const userExists = await this.prisma.users.findUnique({ where: { email } });
        if (userExists) {
            throw new BadRequestException('User already exists');
        }
        const hashPassword = bcrypt.hashSync(password, 10);
        const user = await this.prisma.users.create({
            data: {
                ...body,
                skill: body.skill?.join(','),
                certification: body.certification?.join(','),
                password: hashPassword,
                role: 'USER',
            }
        });
        return user;
    }
}
