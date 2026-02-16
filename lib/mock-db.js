// Mock user database (static, no MongoDB required)
const MOCK_USERS = [
  {
    _id: '1',
    name: 'Test User',
    email: 'user@test.com',
    password: 'user123', // In real app, this would be hashed
    role: 'USER',
    phone: '1234567890',
    department: 'Computer Science',
  },
  {
    _id: '2',
    name: 'Admin User',
    email: 'admin@jspm.edu',
    password: 'admin123',
    role: 'ADMIN',
    phone: '9876543210',
    department: 'Administration',
  },
  {
    _id: '3',
    name: 'Department Head',
    email: 'dept@test.com',
    password: 'dept123',
    role: 'DEPARTMENT_HEAD',
    phone: '5555555555',
    department: 'Maintenance',
  },
];

// Simulate user registration (stores in memory only)
let registeredUsers = [...MOCK_USERS];

export function findUserByEmail(email) {
  return registeredUsers.find(user => user.email === email);
}

export function createUser(userData) {
  const existingUser = findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const newUser = {
    _id: String(registeredUsers.length + 1),
    ...userData,
    role: 'USER', // Default role for new registrations
  };

  registeredUsers.push(newUser);
  return newUser;
}

export function validatePassword(user, password) {
  return user.password === password;
}

export function getUserWithoutPassword(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
