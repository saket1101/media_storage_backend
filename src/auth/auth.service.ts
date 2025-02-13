import { Injectable } from '@nestjs/common';
import { loginDto, RegisterDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async register(registerDto: RegisterDto, res: Response) {
    try {
      const { name, email, password } = registerDto;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: 'Password must be atleast 6 characters long' });
      }
      const user = await this.UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.UserModel({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(loginDto: loginDto, res: Response) {
    try {
      const { email, password } = loginDto;
      if (!email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      const user = await this.UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const jwtsign =await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res
        .cookie('token', jwtsign, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          expires: new Date(Date.now() + 604800000),
        })
        .status(200)
        .json({status:true, message: 'Login successful', data: user });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
