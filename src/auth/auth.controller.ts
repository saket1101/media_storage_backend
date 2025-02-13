import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  RegisterDto,loginDto } from './dto/create-auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  create(@Body() registerDto: RegisterDto,@Res() res:Response) {
    return this.authService.register(registerDto,res);
  }

  @Post("/login")
  login(@Body() loginDto: loginDto,@Res() res:Response) {
    return this.authService.login(loginDto,res);
  }

}
