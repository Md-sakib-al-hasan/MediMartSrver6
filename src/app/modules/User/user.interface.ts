import { Document, Model } from 'mongoose';
import { UserGender } from './user.constant';

export type Gender = (typeof UserGender)[number];

export enum UserRole {
  ADMIN = 'admin',
  USER = 'customer',
}

export interface IUser extends Document {
  userid: string;
  email: string;
  phone?: string;
  password: string;
  name: string;
  role: UserRole;
  gender?: Gender;
  address?: string;
  dateOfBirth?: Date;
  profilePicture?: string;
  status: string;
  lastLogin: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<IUser> {
  isPasswordMatched(
    _plainTextPassword: string,
    _hashedPassword: string,
  ): Promise<boolean>;

  isUserExistsByEmail(_id: string): Promise<IUser>;
  checkUserExist(_userId: string): Promise<IUser>;
}
