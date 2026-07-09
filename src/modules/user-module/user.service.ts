import bcrypt from "bcrypt";
import { AppDataSource } from "../../config/data-source.js";
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  UpdateUserDto,
  VerifyOtpDtpo,
} from "../../dto/auth.dto.js";
import { UserRoleEnum } from "../../enum/common.js";
import { User } from "../../interfaces/user.interface.js";
import { MailService } from "../mail-module.ts/mail.service.js";
import { WorkspaceMembersEntity } from "../workspace-module/entity/workspace-members.entity.js";
import { UserEntity } from "./user.entity.js";

export class UserService {
  private mailService: MailService;
  private userRepository = AppDataSource.getRepository(UserEntity);
  private workspaceMemberRepository = AppDataSource.getRepository(
    WorkspaceMembersEntity,
  );

  constructor() {
    this.mailService = new MailService();
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getUsersByWorkspace(
    workspaceId: string,
    userId: string,
    search: string,
    limit: number,
    offset: number,
  ) {
    const query = this.workspaceMemberRepository
      .createQueryBuilder("members")
      .leftJoinAndSelect("members.user", "user")
      .leftJoinAndSelect("members.workspace", "workspace")
      .select([
        "workspace.id",
        "workspace.name",
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "user.avatar",
        "members.role",
      ])
      .where("workspace.id = :workspaceId", { workspaceId })
      .andWhere("user.id != :userId", { userId })
      .limit(limit)
      .offset(offset);

    if (search) {
      query.andWhere(
        "user.first_name ILIKE :search OR user.last_name ILIKE :search OR (user.first_name || ' ' || user.last_name) ILIKE :search OR (user.first_name ||  user.last_name) ILIKE :search",
        {
          search,
        },
      );
    }

    const [users, count] = await query.getManyAndCount();

    const totalPages = Math.ceil(count / limit);
    const pageNo = offset / limit + 1;

    return {
      users: users,
      pagination: {
        limit,
        offset,
        pageNo,
        totalPages,
        total: count,
      },
    };
  }

  async createUser(payload: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new Error("Account already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const newUser = this.userRepository.create({
      ...payload,
      password: hashedPassword,
      avatar: "profile-icon",
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async loginUser(payload: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      throw new Error("User does not exist for this email");
    }

    const passwordMatched = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new Error("Invalid password");
    }

    // Right now checking only single role because of being part of only one repository
    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        user: { id: user.id },
      },
      relations: ["workspace"],
    });

    return {
      ...user,
      role: workspaceMember?.role as UserRoleEnum,
      workspaceId: workspaceMember?.workspace.id as string,
    };
  }

  async updateUser(id: string, payload: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = this.userRepository.merge(user, payload);

    return this.userRepository.save(updatedUser);
  }

  async forgotPassword(
    payload: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!existingUser) {
      throw new Error("User does not exist for this email");
    }

    if (existingUser.otpExpiry && existingUser.otpExpiry > new Date()) {
      throw new Error(`OTP has already been sent to ${payload.email}`);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.userRepository.update(
      {
        email: payload.email,
      },
      {
        otp: otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
      },
    );

    await this.mailService.sendOtpMail(payload.email, otp);

    return { message: `OTP sent to ${payload.email}` };
  }

  async verifyOtp(payload: VerifyOtpDtpo): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!existingUser) {
      throw new Error("User does not exist for this email");
    }

    if (existingUser.otp && existingUser.otpExpiry) {
      if (existingUser.otpExpiry < new Date()) {
        throw new Error("OTP has been expired, click resend OTP");
      } else if (existingUser.otp !== payload.otp) {
        throw new Error("Invalid OTP");
      } else {
        await this.userRepository.update(
          {
            email: payload.email,
          },
          {
            otp: null,
            otpExpiry: null,
            otpVerified: true,
          },
        );

        return { message: "OTP verified" };
      }
    } else {
      return {
        message: "OTP not stored",
      };
    }
  }

  async resetPassword(payload: ResetPasswordDto): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!existingUser) {
      throw new Error("User does not exist for this email");
    }

    if (!existingUser.otpVerified) {
      throw new Error("OTP is not verified");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    await this.userRepository.update(
      {
        email: payload.email,
      },
      {
        password: hashedPassword,
        otpVerified: false,
      },
    );

    return {
      message: "Password updated successfully",
    };
  }
}
