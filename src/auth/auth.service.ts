import { Injectable } from '@nestjs/common';
import { loginDto, registerDto } from './dto/create-auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  async register(registerDto: registerDto, res: Response) {
    try {
    } catch (error) {}
  }

  async login(loginDto: loginDto, res: Response) {
    try {
    } catch (error) {}
  }
}
