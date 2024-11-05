// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserResponseModel } from '../common/models/response.model';
import { DatabaseService } from 'src/services/database.service';
import { AppError, BadRequestError, UnauthorizedError } from 'src/utils/error-handeling/app.error';
import { Messages } from 'src/utils/repo/message.resource';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService
  ) {}

  async register(username: string, email: string, password: string): Promise<UserResponseModel> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const queryText = 'CALL register_user($1, $2, $3)';
      const res = await this.databaseService.execute(queryText, [username, email, hashedPassword]);
      return res.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new BadRequestError(Messages.EMAIL_ALREADY_EXISTS);
      }
      throw new AppError(Messages.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async login(email: string, password: string): Promise<UserResponseModel> {
    try {
      const queryText = 'SELECT * FROM login_user($1, $2)';
      const res = await this.databaseService.execute(queryText, [email, password]);
      if (res.rows.length > 0) {
        const user = res.rows[0];
        const payload = { id: user.id, email: user.email };
        const token = this.jwtService.sign(payload);
        return { ...user, token };
      }
      throw new UnauthorizedError(Messages.INVALID_CREDENTIALS);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new AppError(Messages.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const queryText = 'SELECT * FROM validate_user($1)';
      const res = await this.databaseService.execute(queryText, [email]);
      if (res.rows.length > 0) {
        const user = res.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw new AppError(Messages.INTERNAL_SERVER_ERROR, 500);
    }
  }
}
