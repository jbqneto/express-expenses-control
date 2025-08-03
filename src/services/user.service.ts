import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function createUser(data: { name: string; email: string; password: string }) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword
    }
  });
}

export async function findUserByUsername(email: string) {
  return prisma.user.findUnique({ where: { email: email } });
}

export async function findOrCreateUser(data: { name: string; email: string; googleId: string }) {
  let user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: "", // No password for OAuth users
      }
    });
  }
  return user;
}