import { Injectable } from '@nestjs/common';
import * as jsonwebtoken from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../../common/constants/app.constants';

@Injectable()
export class TokenService {
  createTokens(userId, role) {
    const accessToken: string = jsonwebtoken.sign(
      {
        userId,
        role
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '60m' },
    );
    const refreshToken = jsonwebtoken.sign(
      {
        userId,
        role
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' },
    );

    return {
      tokens: {
        accessToken,
        refreshToken,
      }
    };
  }

  verifyAccessToken(accessToken: string, options?: jsonwebtoken.VerifyOptions) {
    const decode = jsonwebtoken.verify(
      accessToken,
      ACCESS_TOKEN_SECRET,
      options,
    );
    return decode;
  }

  verifyRefreshToken(refreshToken) {
    const decode = jsonwebtoken.verify(refreshToken, REFRESH_TOKEN_SECRET);
    return decode;
  }
}
