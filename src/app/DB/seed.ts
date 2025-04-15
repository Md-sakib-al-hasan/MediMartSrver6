import { UserRole } from '../modules/user/user.interface';
import User from '../modules/user/user.model';

const adminUser = {
  email: 'admin@ph.com',
  password: 'admin123',
  name: 'Admin',
  role: UserRole.ADMIN,
};

const seedAdmin = async () => {
  try {
    // Check if an admin already exists
    const isAdminExist = await User.findOne({ role: UserRole.ADMIN });

    if (!isAdminExist) {
      await User.create(adminUser);

      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

export default seedAdmin;
