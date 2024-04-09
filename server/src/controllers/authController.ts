import { Response } from "express";

import IRequest from '../types/request';

import AuthService from '../services/authService';
import TokenService from '../services/tokenService'
import UserService from "../services/userService";

const login = async (req: IRequest, res: Response) => {
  const { phone, password } = req.body;
  try {
    const authenticatedUser = await AuthService.authenticateUser({phone, password}, req);
    if (!authenticatedUser) return res.status(401).json({ message: 'Invalid phone or password' });
    else res.status(200).json({
      token: TokenService.generateToken(authenticatedUser),
      message: "Login successful" 
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req: IRequest, res: Response) => {
  const { phone, password, name, email } = req.body;
  try {
    if (!phone || !password || !name) {
      return res.status(400).json({ message: 'Phone, Password and Name are required fields for registration' });
    }
    let doesUserExist = await AuthService.doesUserExist({phone}, req);
    if (doesUserExist) return res.status(400).json({ message: 'User already exists' });
    console.log('New User! Trying to add to the database.')

    // Test password
    if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long and contain at least one number and one special character' });
    }
    console.log('Password allowed')

    var registeredUser = await UserService.save({phone, password, name, email}, req);
    if (!registeredUser.id) return res.status(500).json({ message: 'Failed to register user' });
    else res.status(201).json({ 
      token: TokenService.generateToken(registeredUser.id),
      user: JSON.parse(JSON.stringify(registeredUser)),
      message: 'User registration successful' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  login,
  register
}