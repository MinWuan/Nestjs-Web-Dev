import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LogoutInput {
  sessionId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLogger,
  ) {
    this.logger.setPrefix('AuthService');
  }

  async login(input: LoginInput) {

  }

  async logout(input: LogoutInput) {
    this.logger.log(`→ Logout | sessionId=${input.sessionId ?? 'unknown'}`);

    // ============================================================
    // MẪU CODE: Thay thế bằng logic thật
    // 1. Xoá session khỏi database
    // 2. Thêm token vào blacklist (nếu dùng JWT)
    // 3. Clear refresh token
    // ============================================================

    this.logger.log(
      `← Logout success | sessionId=${input.sessionId ?? 'unknown'}`,
    );
    return {
      success: true,
      message: 'Logout successful',
    };
  }

  async refreshToken(refreshToken: string) {
    this.logger.log(`→ Refresh token attempt`);

    // ============================================================
    // MẪU CODE: Thay thế bằng logic thật
    // 1. Kiểm tra refresh token có hợp lệ không
    // 2. Tạo access token mới
    // 3. Cập nhật session nếu cần
    // ============================================================

    const newAccessToken = `mock_access_token_${Date.now()}`;
    const newRefreshToken = `mock_refresh_token_${Date.now()}`;

    this.logger.log(`← Refresh token success`);
    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
