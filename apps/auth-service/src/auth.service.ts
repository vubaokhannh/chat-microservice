import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { TokenService } from './token.service';
import { ERROR_MESSAGES } from '../../../libs/common/constants/error.messages';
import { SUCCESS_MESSAGES } from '../../../libs/common/constants/success.messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const tokenHash = await this.tokenService.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException(ERROR_MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.tokenService.hashToken(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        avatar: dto.avatar,
      },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const tokens = await this.tokenService.generateTokens(payload);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const passwordMatch = await this.tokenService.compareToken(
      dto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const tokens = await this.tokenService.generateTokens(payload);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const { userId, refreshToken } = dto;

    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    for (const token of tokens) {
      const match = await this.tokenService.compareToken(
        refreshToken,
        token.tokenHash,
      );

      if (match) {
        await this.prisma.refreshToken.delete({
          where: { id: token.id },
        });

        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new UnauthorizedException();
        }

        const payload: JwtPayload = {
          sub: user.id,
          email: user.email,
        };

        const newTokens = await this.tokenService.generateTokens(payload);

        await this.saveRefreshToken(user.id, newTokens.refreshToken);

        return newTokens;
      }
    }

    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN);
  }

  async logout(dto: LogoutDto) {
    const { userId, refreshToken } = dto;

    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    for (const token of tokens) {
      const match = await this.tokenService.compareToken(
        refreshToken,
        token.tokenHash,
      );

      if (match) {
        await this.prisma.refreshToken.delete({
          where: { id: token.id },
        });

        return { message: SUCCESS_MESSAGES.AUTH.LOGOUT_SUCCESS };
      }
    }

    throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN);
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return {
      message: SUCCESS_MESSAGES.AUTH.LOGOUT_ALL_SUCCESS,
    };
  }
}
