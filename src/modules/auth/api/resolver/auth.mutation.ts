import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from '../../auth.service';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { UserRepositoryFacade } from '@modules/user';
import { LoginUseCase } from '@modules/auth/use-case';
import { GqlAppException } from '@/common/exception/GqlAppException';

@Resolver()
export class AuthMutationResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepositoryFacade: UserRepositoryFacade,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Mutation(() => resDto.AuthResult)
  async login(
    @Args('input') args: argsDto.LoginArgs,
  ): Promise<resDto.AuthResult> {
    const result = await this.loginUseCase.execute(args).catch((error) => {
      throw GqlAppException.InternalServerError({
        message: 'Login failed',
        details: error,
      });
    });
    return {
      message: 'Login successful',
      data: result.data,
      token: result.token,
    };
  }

  // @Mutation(() => resDto.LogoutResult)
  // async logout(
  //   @Args('input') args: argsDto.LogoutArgs,
  // ): Promise<resDto.LogoutResult> {
  //   return this.authService.logout({
  //     sessionId: args.sessionId,
  //   });
  // }
}
