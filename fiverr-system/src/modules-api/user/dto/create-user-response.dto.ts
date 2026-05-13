import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() email: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  phone: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  birth_day: Date | string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  gender: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  skill: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  certification: string;

  @Expose() role: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  avatar: string;

  @Exclude()
  password?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

