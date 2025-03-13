import config from '../config';
import { User } from '../modules/User/user.model';

const superUser = {
  name: config.super_admin_name,
  email: config.super_admin_email,
  password: config.super_admin_password,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({
    email: config.super_admin_email,
  });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
