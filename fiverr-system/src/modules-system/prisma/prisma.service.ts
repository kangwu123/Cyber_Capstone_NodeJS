import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { DATABASE_URL } from '../../common/constants/app.constants';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const dbUrl = new URL(DATABASE_URL);
    const adapter = new PrismaMariaDb({
      host: dbUrl.hostname,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.substring(1),
      port: Number(dbUrl.port),
      connectionLimit: 5,
    });
    super({ adapter });
  }
}
