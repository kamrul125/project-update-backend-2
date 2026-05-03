import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config'; // আপনার পাথ অনুযায়ী

export const generateToken = (payload: any) => {
  const secret = config.jwt_access_secret as Secret;
  
  // এখানে 'as any' অথবা 'as SignOptions' ব্যবহার করলে এরর চলে যাবে ✅
  const options: SignOptions = {
    expiresIn: config.jwt_access_expires_in as any, 
  };

  return jwt.sign(payload, secret, options);
};