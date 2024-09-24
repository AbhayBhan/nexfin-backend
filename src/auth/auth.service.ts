import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { count, eq, or } from 'drizzle-orm';
import { db } from 'src/drizzle/db';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { createJwtToken } from 'src/utils/authUtils';
import { UserTable } from 'src/drizzle/schema';

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

      const accessToken = await createJwtToken({
        username: user[0].username,
        email: user[0].email,
        id: user[0].id,
      });

      // await prisma.account.create({
      //   data: {
      //     userId: user.id,
      //   },
      // });

      return { user : user[0], accessToken };
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

      const accessToken = await createJwtToken({
        username: user.username,
        email: user.email,
        id: user.id,
      });

      delete user.password;
      delete user.id;

      return { user, accessToken };
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
}
