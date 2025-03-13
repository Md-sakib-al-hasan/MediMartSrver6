/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
export interface Tuser {
  name: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<Tuser> {
  isUserExistsByEmail(id: string): Promise<Tuser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
