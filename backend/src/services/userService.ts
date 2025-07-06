import { PrismaClient } from "@prisma/client";
import { User } from "@shared/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";


const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;
const saltRounds = 10;

export const createUser = async ({ name, email, password, }: User) => {
    console.log(name,email,password)
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });

    

    if (existingUser) throw new Error("Este email já está em uso.");

    if (password.length < 8) throw new Error("A senha deve ter pelo menos 8 caracteres.");

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return { result };
};

export const getUserInfo = async (token: any) => {
    const decoded = jwt.verify(token, SECRET_KEY) as User;
    return decoded;
};

// Adicionando a função para buscar todos os usuários
export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            
        },
    });
    return users;
};

export const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            
        },
    });
    return user;
};

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email: email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            
        },
    });
    return user;
};

export const AttPasswordService = async (id: number, password: string, newpassword: string) => {
    // Obtenha o usuário pelo ID
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    // Verifique se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Senha atual incorreta.");
    }

    // Gere o hash da nova senha
    const newHashedPassword = await bcrypt.hash(newpassword, saltRounds);

    // Atualize a senha no banco de dados
    const changedPassword = await prisma.user.update({
        where: { id },
        data: { password: newHashedPassword },
    });

    return changedPassword;
};

export const updateUserService = async (user: User, userId: number) => {
    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: user.name,
            email: user.email,
            
        },
    });
    return updatedUser;
};
