import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { JwtPayload } from './types/jwt-payload.type';

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }

  async generateTokens(payload: JwtPayload): Promise<JwtTokens> {
    const accessExpires = this.getEnv('JWT_ACCESS_EXPIRES') as StringValue;
    const refreshExpires = this.getEnv('JWT_REFRESH_EXPIRES') as StringValue;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.getEnv('JWT_ACCESS_SECRET'),
        expiresIn: accessExpires,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.getEnv('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpires,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.getEnv('JWT_ACCESS_SECRET'),
    });
  }

  async verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.getEnv('JWT_REFRESH_SECRET'),
    });
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  async hashToken(value: string): Promise<string> {
    const rounds = Number(this.getEnv('BCRYPT_ROUNDS') || 10);
    return bcrypt.hash(value, rounds);
  }

  async compareToken(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
