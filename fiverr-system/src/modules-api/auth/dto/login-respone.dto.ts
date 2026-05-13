import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class TokenDto {
  @Expose() accessToken!: string;
  @Expose() refreshToken!: string;
}

export class LoginResponseDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() email: string;
  @Expose()
  @Transform(({ value }) => value ?? '')
  phone: string;
  @Expose() @Transform(({ value }) => value ?? '')
  birth_day!: Date;
  @Expose() @Transform(({ value }) => value ?? '')
  gender: string;
  @Expose() role: string;
  @Expose() @Transform(({ value }) => value ?? '')
  skill: string;
  @Expose() @Transform(({ value }) => value ?? '')
  certification: string;

  @Exclude()
  password?: string;

  @Expose()
  @Type(() => TokenDto)
  tokens: TokenDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
