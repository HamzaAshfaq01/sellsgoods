import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    phone: '+92123456789',
    role: 'admin',
  },
  {
    name: 'Seller',
    email: 'seller@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    phone: '+92123456789',
    role: 'seller',
  },
  {
    name: 'Buyer',
    email: 'buyer@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    phone: '+92123456789',
    role: 'buyer',
  },
];

export default users;
