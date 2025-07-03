const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/fileHandler');

const USERS_FILE = 'users.json';

// Register a new user
const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });
console.log(USERS_FILE,'USERS_FILE')
  const users = await readData(USERS_FILE);
console.log(users)
  const existingUser = users.find(user => user.email === email);
  if (existingUser)
    return res.status(409).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuidv4(),
    email,
    password: hashedPassword
  };

  users.push(newUser);
  await writeData(USERS_FILE, users);

  res.status(201).json({ message: 'User registered successfully' });
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const users = await readData(USERS_FILE);
  const user = users.find(u => u.email === email);

  if (!user)
    return res.status(401).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

module.exports = {
  register,
  login
};
