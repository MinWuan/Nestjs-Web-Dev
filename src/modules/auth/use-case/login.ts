import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { UserRepositoryFacade } from '@/modules/user';
// import { RestAppException } from '@/common/exception/RestAppException';
import { comparePassword } from '@/shared/utils/bcrypt.util';
import { GqlAppException } from '@/common/exception/GqlAppException';
import { JwtService } from '@nestjs/jwt';
import { SessionRepositoryFacade } from '@/modules/session';
import { config } from '@/config.app';
import { keyJWT, PayloadSession } from '@/common/constants/common';
import { RoleEnum } from '@/modules/role/entity';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly logger: AppLogger,
    private userRepositoryFacade: UserRepositoryFacade,
    private sessionRepositoryFacade: SessionRepositoryFacade,
    private jwtService: JwtService,
  ) {
    this.logger.setPrefix('LoginUseCase');
  }
  async execute(input: { email: string; password: string }) {
    this.logger.log(`→ Login attempt | email=${input.email}`);

    const user = await this.userRepositoryFacade
      .findByEmail(input.email)
      .catch((error) => {
        this.logger.error({
          message: `← Login failed`,
          trace: error?.stack,
          meta: {
            email: input.email,
          },
        });
        throw GqlAppException.InternalServerError({
          message: 'Login failed',
          details: error,
        });
      });
    if (!user) {
      this.logger.warn(
        `← Login failed | email=${input.email} | user not found`,
      );
      throw GqlAppException.NotFound({
        message: 'Invalid email or password',
        details: {
          email: input.email,
        },
      });
    }

    const passwordsMatch: boolean = await comparePassword(
      input.password,
      user.password ?? '',
    );
    if (!passwordsMatch) {
      this.logger.warn(
        `← Login failed | email=${input.email} | password not match`,
      );
      throw GqlAppException.BadRequest({
        message: 'Invalid email or password',
        details: {
          email: input.email,
        },
      });
    }

    if (passwordsMatch && user?.status !== 'VERIFIED') {
      this.logger.warn(
        `← Login failed | email=${input.email} | user not verified`,
      );
      throw GqlAppException.BadRequest({
        message: 'User not verified',
        details: {
          email: input.email,
        },
      });
    }
    const isSuccess =
      passwordsMatch &&
      user?._id &&
      user?.status === 'VERIFIED' &&
      user?.role?._id;

    if (isSuccess) {
      // ========================== CREATE SESSION ==========================
      const session = await this.sessionRepositoryFacade
        .createSession({
          id_user: user?._id,
          email: user?.email ?? '',
          expired_at: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days
        })
        .catch((error) => {
          this.logger.error({
            message: `← Login failed`,
            trace: error?.stack,
            meta: {
              email: input.email,
              message: 'Failed to create session',
            },
          });
          throw GqlAppException.InternalServerError({
            message: 'Login failed',
            details: error,
          });
        });
      if (!session) {
        throw GqlAppException.InternalServerError({
          message: 'Login failed',
          details: {
            email: input.email,
          },
        });
      }
      // ========================== CREATE TOKEN ==========================
      const payload: PayloadSession = {
        session_id: session?._id.toString(),
        key: keyJWT.SESSION,
      };
      const token = await this.jwtService
        .signAsync(payload, {
          secret: config.JWT_KEY_AUTH,
          algorithm: 'HS256',
          audience: 'server',
          issuer: 'client',
          subject: keyJWT.SESSION,
          expiresIn: config.JWT_EXPIRES_AUTH,
        })
        .catch((error) => {
          this.logger.error({
            message: `← Login failed`,
            trace: error?.stack,
            meta: {
              email: input.email,
              message: 'Failed to create token',
            },
          });
          throw GqlAppException.InternalServerError({
            message: 'Login failed',
            details: error,
          });
        });

      const dataSession = {
        email: user?.email,
        id_user: user?._id,
        session_id: session?._id,
        id_role: {
          _id: user?.role?._id,
          role: user?.role?.role as RoleEnum,
        },
      };

      return {
        data: dataSession,
        token: token,
      };
    }

    this.logger.warn(
      `← Login failed | email=${input.email} | isSuccess=${isSuccess}`,
    );
    throw GqlAppException.InternalServerError({
      message: 'Login failed',
      details: {
        email: input.email,
      },
    });
  }
}
