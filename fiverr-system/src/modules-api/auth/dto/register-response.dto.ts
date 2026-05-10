import { Exclude, Expose, Transform } from 'class-transformer';

export class RegisterResponseDto {
  @Expose() id!: number;
  @Expose() name!: string;
  @Expose() email!: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  phone!: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  birth_day!: Date | string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  gender!: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  skill!: string;

  @Expose()
  @Transform(({ value }) => value ?? '')
  certification!: string;

  @Expose() role!: string;

  @Exclude()
  password?: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
