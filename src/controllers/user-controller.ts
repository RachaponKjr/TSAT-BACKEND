import { Request, Response } from 'express';
import {
  createUserService,
  deleteUserService,
  getUserAllService,
  getUserService,
  updateUserService,
  User
} from '../service/user-service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createUserController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required.' });
      return;
    }

    const existingUser = await getUserService({ username });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists.' }); // ใช้ 409 Conflict แทน
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUserService({
      password: hashedPassword,
      username
    });

    res.status(201).json({ status: 201, data: newUser });
    return;
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};

const getUserController = async (req: Request, res: Response) => {
  try {
    const user = await getUserAllService();
    res.status(200).json({ status: 200, data: user });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginUserController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await getUserService({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '8h'
      }
    );

    res.status(200).json({ status: 200, data: user, token });
  } catch (error) {
    console.error('Login User Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUserService(id);
    res.status(200).json({ status: 200, message: 'ลบข้อมูลเรียบร้อย' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const updateData: Partial<User> = {}; // ไม่ใส่ id ที่นี่ เพราะส่งแยกต่างหาก

    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await updateUserService(id, updateData as User);

    res.status(200).json({ status: 200, message: 'แก้ไขข้อมูลเรียบร้อย' });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export {
  createUserController,
  loginUserController,
  getUserController,
  deleteUserController,
  updateUserController
};
