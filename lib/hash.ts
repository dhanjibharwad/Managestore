import bcrypt from "bcryptjs";

export const hashPassword = (password: string) =>
  bcrypt.hash(password, 10);

export const comparePassword = (password: string, hashed: string) =>
  bcrypt.compare(password, hashed);
