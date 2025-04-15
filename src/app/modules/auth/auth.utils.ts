import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { IJwtPayload, TExpiresIn } from './auth.interface';

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: Secret,
  expiresIn: TExpiresIn,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
