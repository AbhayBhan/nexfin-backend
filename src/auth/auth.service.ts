import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { count, eq, or } from 'drizzle-orm';
import { db } from 'src/drizzle/db';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { createJwtToken, decodeToken } from 'src/utils/authUtils';
import { AccountTable, SettingTable, UserTable } from 'src/drizzle/schema';

@Injectable()
export class AuthService {
  async registerUser(createUserDto: CreateUserDto) {
    try {
      const { username, password, email, firstName, lastName, mobile } =
        createUserDto;

      const usernameExists = await db
        .select({ count: count() })
        .from(UserTable)
        .where(eq(UserTable.username, username));

      if (usernameExists[0].count) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const emailOrMobileExists = await db
        .select({ count: count() })
        .from(UserTable)
        .where(or(eq(UserTable.email, email), eq(UserTable.mobile, mobile)));

      if (emailOrMobileExists[0].count) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const reqBody = {
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName: lastName || '',
        mobile,
      };

      const user = await db.insert(UserTable).values(reqBody).returning({
        id: UserTable.id,
        email: UserTable.email,
        username: UserTable.username,
      });

      const tokenBody = {
        username: user[0].username,
        email: user[0].email,
        id: user[0].id,
      }

      const accessToken = await createJwtToken(tokenBody);

      const refreshToken = await createJwtToken(tokenBody, process.env.REFRESH_EXPIRATION);

      await db.insert(SettingTable).values({
        userId: user[0].id,
        currency: 'INR',
      });

      await db.insert(AccountTable).values({
        userId: user[0].id,
        balance: 0,
      });

      return { access : accessToken, refresh : refreshToken };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;

      let user = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email));

      user = user[0];

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const tokenBody = {
        username: user.username,
        email: user.email,
        id: user.id,
      };

      const accessToken = await createJwtToken(tokenBody);

      const refreshToken = await createJwtToken(tokenBody, process.env.REFRESH_EXPIRATION);

      return { access : accessToken, refresh : refreshToken };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshUser(token : string) {
    try {
      const decoded = await decodeToken(token);

      if(typeof decoded !== "object") {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const tokenBody = {
        username: decoded.username,
        email: decoded.email,
        id: decoded.id,
      };

      const accessToken = await createJwtToken(tokenBody);

      const refreshToken = await createJwtToken(tokenBody, process.env.REFRESH_EXPIRATION);

      return { access : accessToken, refresh : refreshToken };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new HttpException(
        'Failed to refresh token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
