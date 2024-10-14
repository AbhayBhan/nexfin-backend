import { HttpException, HttpStatus } from '@nestjs/common';
import * as FS from 'fs';
import * as jwt from 'jsonwebtoken';
import * as UUID from 'uuid';

const uuid = UUID.v4();
const fs = FS.promises;

type Payload = {
  username: string;
  email: string;
  id: number;
};

const createJwtToken = async (
  payloadData: Payload,
  expiresIn = process.env.EXPIRATION,
): Promise<string | Error> => {
  try {
    const privateKey = await fs.readFile('private_key.pem', 'utf-8');
    const subject = uuid;
    const keyId = uuid.split('-').at(-1);
    const payload = {
      ...payloadData,
      scope: 'get:data_anon',
    };

    const token = jwt.sign(payload, privateKey, {
      issuer: process.env.ISSUER_BASE_URL,
      audience: process.env.AUDIENCE,
      subject: `${subject}@client`,
      algorithm: process.env.ALGO as jwt.Algorithm,
      expiresIn,
      header: { kid: keyId, alg: process.env.ALGO as jwt.Algorithm },
    });

    return token;
  } catch (error) {
    return error as Error;
  }
};

const decodeToken = async (token : string) => {
  try {
    const publicKey = await fs.readFile('public_key.pem', 'utf-8');
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    return decoded;
  } catch (error) {
    throw new HttpException('Token Expired!', HttpStatus.UNAUTHORIZED);
  }
}

export { createJwtToken, decodeToken };
