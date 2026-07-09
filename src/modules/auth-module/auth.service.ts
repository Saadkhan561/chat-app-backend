import jwt from "jsonwebtoken";
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  VerifyOtpDtpo,
} from "../../dto/auth.dto.js";
import { LoginUserResponse, User } from "../../interfaces/user.interface.js";
import { UserEntity } from "../user-module/user.entity.js";
import { UserService } from "../user-module/user.service.js";

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
  }

  async signUp(payload: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.userService.createUser(payload);
    return newUser;
  }

  async loginUser(payload: LoginUserDto): Promise<LoginUserResponse> {
    const user = await this.userService.loginUser(payload);

    const accessToken = this.generateToken(user);

    return {
      accessToken,
      message: "User logged in successfully",
      user: user,
    };
  }

  async forgotPassword(
    payload: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const result = this.userService.forgotPassword(payload);
    return result;
  }

  async verifyOtp(payload: VerifyOtpDtpo): Promise<{ message: string }> {
    const result = this.userService.verifyOtp(payload);
    return result;
  }

  async resetPassword(payload: ResetPasswordDto): Promise<{ message: string }> {
    const result = this.userService.resetPassword(payload);
    return result;
  }
}
