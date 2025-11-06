import { Request, Response, NextFunction } from 'express';
import basicAuth from 'express-basic-auth';

const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'change_me_secure_password';

export const adminAuth = basicAuth({
  users: { [username]: password },
  challenge: true,
  realm: 'Admin Area',
});


